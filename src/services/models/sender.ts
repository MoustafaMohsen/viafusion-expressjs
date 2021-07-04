import { MetaContactService } from './metacontact';
import { UserService } from './user';
import { IDBContact } from './../../interfaces/db/idbcontact';
import { ISender, MetaContactToSender } from './../../interfaces/rapyd/isender';
import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';

export class SenderService {

    create_sender(sender: ISender, contact_reference_id): Promise<ISender> {
        var apiSrv = new ApiService();
        return new Promise((resolve, reject) => {
            apiSrv.post<ISender>("payouts/sender", sender).then(async (res) => {
                let newsender = res.body.data;
                // Update Contact meta here
                let metacontactSrv = new MetaContactService();
                let metacontact = await metacontactSrv.get_db_metacontact({ contact_reference_id } as any);
                metacontact.senders.push(newsender)
                metacontactSrv.update_db_metacontact({ contact_reference_id } as any, metacontact);
                resolve(newsender);
            }).catch(reject)
        })
    }

    async create_sender_from_contact_and_meta(contact_reference_id, meta: MetaContactToSender) {
        let userSrv = new UserService();
        let user = await userSrv.get_db_user({ contact_reference_id });
        let sender: ISender = this.map_contact_to_sender(user, meta);
        return this.create_sender(sender, user.contact_reference_id);
    }

    map_contact_to_sender(contact: IDBContact, meta: MetaContactToSender) {
        let sender: ISender = {
            country: contact.rapyd_contact_data.country,
            first_name: contact.rapyd_contact_data.first_name,
            last_name: contact.rapyd_contact_data.last_name,
            entity_type: "individual",
            phone_number: contact.phone_number,
            date_of_birth: contact.rapyd_contact_data.date_of_birth,
            address: contact.rapyd_contact_data.address as any,
            identification_type: contact.rapyd_contact_data.identification_type,
            identification_value: contact.rapyd_contact_data.identification_number,
            ...meta
        };
        return sender;
    }
}
