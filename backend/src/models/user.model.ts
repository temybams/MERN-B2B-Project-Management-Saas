import mongoose, { Document, Schema, Types } from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt';

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: mongoose.Types.ObjectId | null; 
    comparePassword(value: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, "password">;
};

const userSchema: Schema<UserDocument> = new Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: true,
        },
        profilePicture: {
            type: String,
            default: null,
        },
        currentWorkspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        if (this.password) {
            this.password = await hashValue(this.password);
        }
    }
    next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.methods.comparePassword = async function (value: string) {
    return compareValue(value, this.password);
};


const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;