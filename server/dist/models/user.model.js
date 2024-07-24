"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = exports.hash = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const hash = (data) => {
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
};
exports.hash = hash;
const generateCode = (min = 100000, max = 999999) => {
    let randomNumber = crypto_1.default.randomBytes(4).readUInt32BE(0);
    randomNumber = (randomNumber / (0xffffffff + 1)) * (max - min + 1) + min;
    return Math.floor(randomNumber);
};
exports.generateCode = generateCode;
const userSchema = new mongoose_1.default.Schema({
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
        validate: [validator_1.default.isEmail, "Please enter a valid email."],
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
            validator(value) {
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
}, {
    methods: {
        isPasswordCorrect(password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield bcrypt_1.default.compare(password, this.password);
            });
        },
        isPasswordChanged(JWTTimestamp) {
            if (this.passwordChangedAt) {
                const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
                return JWTTimestamp < changedTimestamp;
            }
            return false;
        },
    },
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, 12);
            this.confirmPassword = undefined;
            if (!this.isNew) {
                this.passwordChangedAt = new Date();
                this.passwordResetCode = undefined;
                this.passwordResetCodeExpires = undefined;
            }
        }
        next();
    });
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
