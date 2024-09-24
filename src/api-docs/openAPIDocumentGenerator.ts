import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { authRegistry } from "../api/auth/authDocs";
import { invoiceRegistry } from "../api/invoice/invoiceDocs";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([authRegistry, invoiceRegistry]);

  // Register the security scheme
  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "EMS Backend API",
    },
    externalDocs: {
      description: "Find out more about MBNNT Backend API",
      url: "/swagger.json",
    },
  });
}
