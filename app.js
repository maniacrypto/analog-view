import { TimegraphClient } from "@analog-labs/timegraph-js";
import { new_cert, build_apikey, encode_ssk, build_ssk } from "@analog-labs/timegraph-wasm";
import { Keyring } from "@polkadot/keyring";
import { waitReady } from "@polkadot/wasm-crypto";

await waitReady();

const hashId="";
const viewName="";
const fields=["_clock", "_index"];
const addr = "";
const phrase = "";
// init polkadot keypair for node env
const keyring = new Keyring({ type: "sr25519" });
const keypair =  keyring.addFromUri(phrase);
//Pass signer and address to get keygen instance
const [cert, secret] = new_cert(addr, 'developer');


const signedData = keypair.sign(cert);

const key = build_apikey(secret,cert, signedData);


const ssk_data = encode_ssk({
    ns: 0,
    key: addr,
    user_id: 1,
    expiration: 0,
  });

  const ssk_signature = keypair.sign(ssk_data);
  const ssk = build_ssk(ssk_data, ssk_signature);

  const client = new TimegraphClient({
      url: "https://timegraph.testnet.analog.one/graphql",
      sessionKey: ssk,
  });

  const response1 = await client.alias.add({
      hashId: hashId, // Look at watch.analog
      name: viewName, // Look at watch.analog
  });

  console.log(response1);

  const response2 = await client.view.data({
      hashId: hashId, // Look at watch.analog
      fields: fields, // Fields to return
      limit: "5", // Number of records required
  });

  console.log(response2);


