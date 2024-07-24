"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: "./config.env" });
const app_1 = __importDefault(require("./app"));
mongoose_1.default.connect(process.env.HOST_CONN_STR).then((conn) => {
    console.log(`Connected successfully...`);
});
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running...`);
});
