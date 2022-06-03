import { Router } from "express";
import { CreateTransferController } from "../modules/statements/useCases/createTransfer/CreateTransferController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";

const transferRoutes = Router();

transferRoutes.use(ensureAuthenticated);

const createTransferController = new CreateTransferController();

transferRoutes.post('/', ensureAuthenticated, createTransferController.handle);

export { transferRoutes };