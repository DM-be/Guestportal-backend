import { Injectable } from '@nestjs/common';
import {
  PKCS11,
  CKF_RW_SESSION,
  CKF_SERIAL_SESSION,
  CKA_CLASS,
  CKO_DATA,
  CKA_LABEL,
  CKA_VALUE,
} from 'pkcs11js';
import { EidGateway } from 'src/eid-gateway/eid-gateway.gateway';
import { EidUser } from 'src/models/EidUser';


@Injectable()
export class Pkcs11Service {
  private pkcs11: PKCS11;
  private LIB = '/usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0'; // todo: get from environment (docker-compose)

  constructor(private readonly eidGateway: EidGateway) {
    this.pkcs11 = new PKCS11();
    this.pkcs11.load(this.LIB);    
  }

  private openSession(): Buffer {
    this.pkcs11.C_Initialize();
    const slots = this.pkcs11.C_GetSlotList(true);
    const slot = slots[0];
    return this.pkcs11.C_OpenSession(slot, CKF_RW_SESSION | CKF_SERIAL_SESSION);
  }

  private readObjects(session: Buffer): EidUser {
    let eidUser: EidUser = {
      firstNames: [],
      surName: undefined
    }
    this.pkcs11.C_FindObjectsInit(session, [
      { type: CKA_CLASS, value: CKO_DATA },
    ]);
    let hObject = this.pkcs11.C_FindObjects(session);
    while (hObject) {
      const attrs = this.pkcs11.C_GetAttributeValue(session, hObject, [
        { type: CKA_LABEL },
        { type: CKA_VALUE },
      ]);
      if (attrs[0].value !== undefined && attrs[1].value !== undefined) {
        switch (attrs[0].value.toString()) {
          case 'national_number':
            break;
          case 'firstnames':
            console.log(eidUser);
            console.log( attrs[1].value.toString())
            eidUser.firstNames = attrs[1].value.toString().split(' ');
            break;
          case 'surname':
            console.log(eidUser);

            eidUser.surName = attrs[1].value.toString();
            break;
          // case 'card_number':
          //   console.log(attrs[1].value.toString());
          //   break;
          // case 'chip_number':
          //   console.log(attrs[1].value.toString());
          //   break;
          // case 'gender':
          //   console.log(attrs[1].value.toString());
          //   break;
          // case 'nationality':
          //   console.log(attrs[1].value.toString());
          //   break;
          // case 'document_type':
          //   console.log(attrs[1].value.toString());
          //   break;
        }
      }
      hObject = this.pkcs11.C_FindObjects(session);
    }
    this.pkcs11.C_CloseSession(session);
    this.pkcs11.C_Finalize();
    return eidUser;
  }

  public async getEidUserFromReader(): Promise<void> {
    try {
       await this.eidGateway.sendEidUser(this.readObjects(this.openSession()));
    } catch (error) {
      console.log(error);
    }
  }


  public testSocket() {
   /// this.eidGateway.sendEidData("test");
  }
}
