import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const hash = (data: string) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

export const generateCode = (min = 100000, max = 999999) => {
  let randomNumber = crypto.randomBytes(4).readUInt32BE(0);
  randomNumber = (randomNumber / (0xffffffff + 1)) * (max - min + 1) + min;
  return Math.floor(randomNumber);
};

export interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordChangedAt?: Date;
  passwordResetCode?: string;
  passwordResetCodeExpires?: Date;
  active?: boolean;
}
interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  isPasswordChanged(JWTTimestamp: number): boolean;
}

const userSchema = new mongoose.Schema<
  IUser,
  mongoose.Model<IUser>,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email."],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
      trim: true,
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password."],
      trim: true,
      validate: {
        validator(this: any, value: string) {
          return this.password === value;
        },
        message: "Passwords do not match.",
      },
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    methods: {
      async isPasswordCorrect(password: string) {
        return await bcrypt.compare(password, this.password);
      },
      isPasswordChanged(JWTTimestamp: number) {
        if (this.passwordChangedAt) {
          const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
          return JWTTimestamp < changedTimestamp;
        }
        return false;
      },
    },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined!;
    if (!this.isNew) {
      this.passwordChangedAt = new Date();
      this.passwordResetCode = undefined;
      this.passwordResetCodeExpires = undefined;
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
