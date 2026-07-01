import { Router } from "express";
import {
  getAccounts, createAccount, getAccount, deleteAccount,
  createCharacter, updateCharacter, deleteCharacter,
  updateMain6, updateRaidStatus,
} from "./lostark.controller.js";

const router = Router();

// Accounts
router.get("/accounts",     getAccounts);
router.post("/accounts",    createAccount);
router.get("/accounts/:id", getAccount);
router.delete("/accounts/:id", deleteAccount);
router.put("/accounts/:id/main6", updateMain6);

// Characters
router.post("/accounts/:id/characters",              createCharacter);
router.put("/accounts/:id/characters/:charId",       updateCharacter);
router.delete("/accounts/:id/characters/:charId",    deleteCharacter);
router.patch("/accounts/:id/characters/:charId/raid", updateRaidStatus);

export default router;
