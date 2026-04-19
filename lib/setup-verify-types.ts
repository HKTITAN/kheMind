export type SetupVerifyResult = {
  ok: boolean;
  message: string;
  skipped?: boolean;
};

export type SetupVerifyResponse = {
  ok: boolean;
  results: {
    convex?: SetupVerifyResult;
    ingest?: SetupVerifyResult;
    mcp?: SetupVerifyResult;
    vault?: SetupVerifyResult;
  };
};
