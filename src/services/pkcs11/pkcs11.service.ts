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
import * as Devices from 'smartcard/lib/Devices';

const FIRSTNAMES = 'firstnames';
const SURNAME = 'surname';
const DEVICE_ACTIVATED = 'device-activated';
const CARD_INSERTED = 'card-inserted';
const LIB = '/usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0'; // todo: get from environment (docker-compose)

@Injectable()
export class Pkcs11Service {
  private pkcs11: PKCS11;
  private devices: Devices;

  constructor(private readonly eidGateway: EidGateway) {
    this.pkcs11 = new PKCS11();
    this.devices = new Devices();
    this.pkcs11.load(LIB);
    this.listenToEidCardEvents();
  }

  private listenToEidCardEvents() {
    this.devices.on(DEVICE_ACTIVATED, event => {
      const device = event.device;
      device.on(CARD_INSERTED, async x => {
        const eidUser: EidUser = this.readEidUser();
        this.eidGateway.emitEidUser(eidUser);
      });
    });
  }

  private readEidUser(): EidUser {
    return this.readObjects(this.openSession());
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
      surName: undefined,
    };
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
          case FIRSTNAMES:
            eidUser.firstNames = attrs[1].value.toString().split(' ');
            break;
          case SURNAME:
            eidUser.surName = attrs[1].value.toString();
        }
      }
      hObject = this.pkcs11.C_FindObjects(session);
    }
    this.pkcs11.C_CloseSession(session);
    this.pkcs11.C_Finalize();
    return eidUser;
  }
}
