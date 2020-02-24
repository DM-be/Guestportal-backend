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
import { EidGateway } from 'src/gateways/eid-gateway/eid-gateway.gateway';
import { EidUserDto } from 'src/models/EidUserDto';
import * as Devices from 'smartcard/lib/Devices';

const FIRSTNAMES = 'firstnames';
const SURNAME = 'surname';
const DEVICE_ACTIVATED = 'device-activated';
const CARD_INSERTED = 'card-inserted';
const LIB = '/usr/lib/x86_64-linux-gnu/libbeidpkcs11.so.0'; // todo: get from environment (docker-compose)

/**
 *service used to communicate with the pkcs11 standard to read electronic cards
 * uses the pkcs11js library and smartcard library
 *
 * @export
 * @class Pkcs11Service
 */
@Injectable()
export class Pkcs11Service {
  /**
   * variable holding a reference to the PKCS11 library
   *
   * @private
   * @type {PKCS11}
   * @memberof Pkcs11Service
   */
  private pkcs11: PKCS11;

  /**
   * reference to the card reader using smartcard library
   * used to listen to card insertion events
   *
   * @private
   * @type {Devices}
   * @memberof Pkcs11Service
   */
  private devices: Devices;

  /**
   *Creates an instance of Pkcs11Service.
   * @param {EidGateway} eidGateway gateway used to communicate the eid reader data to the frontend
   * @memberof Pkcs11Service
   */
  constructor(private readonly eidGateway: EidGateway) {
    this.pkcs11 = new PKCS11();
    this.devices = new Devices();
   // this.pkcs11.load(LIB);
  //  this.listenToEidCardEvents();
  }

  /**
   * event listener listening to the insertion of EID card into the EID reader
   * reads the card data and emits this to a websocket connection implemented in the EidGateWay class
   *
   *
   * @private
   *
   * @returns {Promise<void>} empty promise when reading and emitting the EID data is successful
   * @memberof Pkcs11Service
   */
  private async listenToEidCardEvents(): Promise<void> {
    this.devices.on(DEVICE_ACTIVATED, event => {
      const device = event.device;
      device.on(CARD_INSERTED, async x => {
        try {
          const eidUser: EidUserDto = this.readEidUser();
          await this.eidGateway.emitEidUser(eidUser);
        } catch (error) {
          console.log(error);
        }
      });
    });
  }

  /**
   * uses the pkcs11js library to read a buffer and return the interpreted objects as an EidUserDto
   *
   * @private
   * @returns {EidUserDto}
   * @memberof Pkcs11Service
   */
  private readEidUser(): EidUserDto {
    return this.readObjects(this.openSession());
  }

  /**
   * opens a session with the pkcs11 library and reads a buffer from the inserted card
   * @private
   * @returns {Buffer} buffer returned by the opening of a session
   * @memberof Pkcs11Service
   */
  private openSession(): Buffer {
    this.pkcs11.C_Initialize();
    const slots = this.pkcs11.C_GetSlotList(true);
    const slot = slots[0];
    return this.pkcs11.C_OpenSession(slot, CKF_RW_SESSION | CKF_SERIAL_SESSION);
  }

  /**
   * reads the objects found in the buffer of a session and converts it to a DTO
   * closes the session afterwards
   *
   * @private
   * @param {Buffer} session the session used to read objects
   * @returns {EidUserDto} the user data in a data object interface
   * @memberof Pkcs11Service
   */
  private readObjects(session: Buffer): EidUserDto {
    let eidUser: EidUserDto = {
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
