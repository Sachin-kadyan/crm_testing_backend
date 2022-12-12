import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FUNCTION_RESPONSE } from "../../types/api/api";
import { REPRESENTATIVE as iRepresentative } from "../../types/representative/representative";
import ErrorHandler from "../../utils/errorHandler";
import MongoService, { REPRESENTATIVE } from "../../utils/mongo";
import { createRepresentative, findRepresentative, REPRESENTATIVE_DB } from "./crud";

const { accessSecret, refreshSecret, accessValidity, refreshValidity } = process.env;

const createPassword = async (password: string): Promise<string> => {
  const rounds = 10;
  return await bcrypt.hash(password, rounds);
};

const createTokens = (representative: iRepresentative): { access: string; refresh: string } => {
  if (refreshSecret && accessSecret) {
    const refresh = jwt.sign(representative, refreshSecret, { expiresIn: refreshValidity });
    const access = jwt.sign(representative, accessSecret, { expiresIn: accessValidity });
    return { refresh, access };
  } else {
    throw new ErrorHandler("Internal server error!", 500, [{ error: "Internal server error" }]);
  }
};

const checkExistingRepresentative = async (email: string) => {
  const respresentative = await findRepresentative({ email });
  if (respresentative)
    throw new ErrorHandler("Representative Already Exist", 400, [{ error: "Representative Already Exist" }]);
};

export const registerRepresentativeHandler = async (
  representative: iRepresentative
): Promise<FUNCTION_RESPONSE> => {
  await checkExistingRepresentative(representative.email);
  representative.password = await createPassword(representative.password!);
  const registeredUser = await createRepresentative(representative);
  delete registeredUser.password;
  const { refresh, access } = createTokens(representative);
  return { status: 200, body: { ...registeredUser, refresh, access } };
};

export const loginRepresentativeHandler = async (
  email: string,
  password: string
): Promise<FUNCTION_RESPONSE> => {
  const representative = await findRepresentative({ email });
  if (!representative) throw new ErrorHandler("NOT FOUND", 404, [{ error: "Email not registered!" }]);
  const matchPassword = await bcrypt.compare(password, representative.password as string);
  if (!matchPassword)
    throw new ErrorHandler("Incorrect email or password!", 401, [{ error: "Incorrect email or password!" }]);
  delete representative.password;
  const { refresh, access } = createTokens(representative);
  return { status: 200, body: { ...representative, access, refresh } };
};

export const getSortedLeadCountRepresentatives = async () => {
  return await MongoService.collection(REPRESENTATIVE)
    .find<iRepresentative>({ role: "REPRESENTATIVE" })
    .sort({ leadAssignedCount: 1 })
    .toArray();
};
