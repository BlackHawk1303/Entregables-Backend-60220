import mongoose from "mongoose"
const emailRecoveryCollection = "EmailRecovery"

const strTypeSchemaRequired = {
    type: String,
    required: true
};
const strTypeSchemaUniqueRequired = {
    type: String,
    required: true, 
    unique: true
};

const emailRecoverySchema = new mongoose.Schema({
    recoverID: strTypeSchemaUniqueRequired,
    email: strTypeSchemaRequired,
    expiration_date: strTypeSchemaRequired,
});

const EmailRecovery = mongoose.model(emailRecoveryCollection, emailRecoverySchema)

export default EmailRecovery;