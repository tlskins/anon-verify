
import { Connection } from "@metaplex/js";
import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";

const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

const connection = new Connection("mainnet-beta");

export const getWalletTokenAddrs = async (
  acctAddr: string
): Promise<string[]> => {
  const data = await connection.getParsedTokenAccountsByOwner(
    new web3.PublicKey(acctAddr),
    { programId: new web3.PublicKey(TOKEN_PROGRAM_ID) }
  );

  return data.value
    .filter(
      (v) =>
        v.account.data.parsed.info.tokenAmount.amount === "1" &&
        v.account.data.parsed.info.tokenAmount.uiAmount === 1
    )
    .map((v) => v.account.data.parsed.info.mint);
};

export const getTokenMetadata = async ( tokenAddr: string ): Promise<Metadata | undefined> => {
  const metadataPDA = await Metadata.getPDA(tokenAddr);
  const mintAccInfo = await connection.getAccountInfo(metadataPDA);
  if ( !mintAccInfo ) return

  return Metadata.from(new Account(tokenAddr, mintAccInfo));
}