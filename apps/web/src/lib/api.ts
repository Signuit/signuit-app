import { baseAppRouter } from "@nexus/api";
import { createContext } from "@nexus/api/context";
import { collateralRouter } from "./collateral-router";

export const appRouter = {
	...baseAppRouter,
	collateral: collateralRouter,
};

export type AppRouter = typeof appRouter;

export { createContext };
