import { UserService } from './user';
import { IDBContact } from './../../interfaces/db/idbcontact';
import { ISender, MetaContactToSender } from './../../interfaces/rapyd/isender';
import { ApiService } from '../api/api';
import { ListPayments, RequiredFields, PostCreatePayment, IPayment } from '../../interfaces/rapyd/ipayment';

export class SenderService {
    create_sender(sender: ISender, contact_reference_id) {
        var apiSrv = new ApiService();
        return new Promise((resolve,reject)=>{
            apiSrv.post<ListPayments.Response[]>("payouts/sender", sender).then(resolve=>{
                // Update Contact here
                let userSrv = new UserService();
                userSrv.update_db_user()
            }).catch(reject)
        })
    }

    create_sender_from_contact(contact: IDBContact, meta: MetaContactToSender) {
        let sender: ISender = this.map_contact_to_sender(contact, meta);
        return this.create_sender(sender,contact.contact_reference_id);
    }
    map_contact_to_sender(contact: IDBContact, meta: MetaContactToSender){
        let sender: ISender = {
            country: contact.data.country,
            first_name: contact.data.first_name,
            last_name: contact.data.last_name,
            entity_type: "individual",
            phone_number:contact.phone_number,
            date_of_birth:contact.data.date_of_birth,
            address:contact.data.address as any,
            identification_type:contact.data.identification_type,
            identification_value:contact.data.identification_number,
            ...meta
        };
        return sender;
    }
}
