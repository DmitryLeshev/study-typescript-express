import { ClientResponse } from "..";

export default class Service extends ClientResponse {
  constructor() {
    super();
    console.log("[Service - constructor]");
  }
}
