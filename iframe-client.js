var StreamCraftIframeLib = function(exports) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  class IframeClient {
    constructor(iframeId) {
      __publicField(this, "iframeId");
      this.iframeId = iframeId;
      this.setupMessageListener();
      this.sendMessage("INITIALIZE", { iframeId });
    }
    setupMessageListener() {
      window.addEventListener("message", (event) => {
        const { type, data, source } = event.data;
        if (source === "parent") {
          const customEvent = new CustomEvent(`iframe-message-${type}`, {
            detail: data
          });
          window.dispatchEvent(customEvent);
        }
      });
    }
    sendMessage(type, data) {
      window.parent.postMessage(
        {
          type,
          data,
          source: this.iframeId,
          timestamp: Date.now()
        },
        "*"
      );
    }
    // Payload management
    setPayload(payload) {
      this.sendMessage("SET_PAYLOAD", payload);
    }
    getPayload() {
      this.sendMessage("GET_PAYLOAD", null);
    }
    getSubcomposition() {
      this.sendMessage("GET_SUBCOMPOSITION", null);
    }
    // Event listeners for parent messages
    onInitialData(callback) {
      window.addEventListener("iframe-message-INITIAL_DATA", (event) => {
        callback(event.detail);
      });
    }
    onItemStateChanged(callback) {
      window.addEventListener("iframe-message-ITEM_STATE_CHANGED", (event) => {
        callback(event.detail);
      });
    }
    onSubcomposition(callback) {
      window.addEventListener("iframe-message-GET_SUBCOMPOSITION", (event) => {
        callback(event.detail);
      });
    }
    // Cleanup method
    destroy() {
      window.removeEventListener("iframe-message-INITIAL_DATA", () => {
      });
      window.removeEventListener("iframe-message-ITEM_STATE_CHANGED", () => {
      });
      window.removeEventListener("iframe-message-GET_SUBCOMPOSITION", () => {
      });
    }
  }
  if (typeof window !== "undefined") {
    window.IframeClient = IframeClient;
  }
  exports.IframeClient = IframeClient;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
}({});
