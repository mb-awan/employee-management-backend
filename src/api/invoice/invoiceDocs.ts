import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { apiRoutes } from "../../common/constants/common";

import { invoicePaths } from "./invoiceRoute";
import {
  createInvoiceSchema,
  deleteInvoiceSchema,
  getAllInvoicesSchema,
  getSingleInvoiceSchema,
  updateInvoiceSchema,
} from "./invoiceSchema";

export const invoiceRegistry = new OpenAPIRegistry();

invoiceRegistry.registerPath({
  method: "get",
  description: `
        This endpoint retrieves all invoices for a user:
          - Pagination: Supports pagination with 'page' and 'limit' query parameters.
          - Authentication: Requires user authentication.
          - Database Interaction: Retrieves invoices from the database and handles pagination.
      `,
  path: `${apiRoutes.invoice}${invoicePaths.getAll}`,
  request: {
    query: getAllInvoicesSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Invoice"],

  responses: {
    200: {
      description: "Invoices retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            invoice: getAllInvoicesSchema,
            pagination: z.object({
              currentPage: z.number(),
              totalPages: z.number(),
              totalRecords: z.number(),
              hasNextPage: z.boolean(),
              hasPrevPage: z.boolean(),
            }),
          }),
        },
      },
    },
    400: {
      description: "Invalid pagination parameters",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
  },
});

invoiceRegistry.registerPath({
  method: "get",
  description: `
        This endpoint retrieves a single invoice by ID:
          - Authentication: Requires user authentication.
          - Database Interaction: Retrieves the specific invoice.
      `,
  path: `${apiRoutes.invoice}${invoicePaths.getSingle}`,
  request: {
    query: getSingleInvoiceSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Invoice"],
  responses: {
    200: {
      description: "Invoice retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            invoice: getSingleInvoiceSchema,
          }),
        },
      },
    },
    404: {
      description: "Invoice not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
  },
});

invoiceRegistry.registerPath({
  method: "post",
  description: `
        This endpoint allows the creation of a new invoice:
          - Authentication: Requires user authentication.
          - Validation: Validate the input body using schema.
          - Database Interaction: Creates and stores a new invoice in the database.
      `,
  path: `${apiRoutes.invoice}${invoicePaths.create}`,
  request: {
    body: {
      description: "Details of the blog   to be created",
      content: {
        "application/json": {
          schema: createInvoiceSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: ["Invoice"],
  responses: {
    200: {
      description: "Invoice created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            invoice: createInvoiceSchema,
          }),
        },
      },
    },
    400: {
      description: "Invalid input data",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
  },
});

invoiceRegistry.registerPath({
  method: "put",
  description: `
        This endpoint allows the update of an existing invoice:
          - Authentication: Requires user authentication.
          - Validation: Validate the input body using schema.
          - Database Interaction: Updates an existing invoice in the database.
      `,
  path: `${apiRoutes.invoice}${invoicePaths.update}`,
  request: {
    query: z.object({
      invoiceId: z.string(),
    }),
    body: {
      description: "Details of the blog  to be Editted",
      content: {
        "application/json": {
          schema: updateInvoiceSchema,
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: ["Invoice"],
  responses: {
    200: {
      description: "Invoice updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            invoice: updateInvoiceSchema,
          }),
        },
      },
    },
    404: {
      description: "Invoice not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
  },
});

invoiceRegistry.registerPath({
  method: "delete",
  description: `
        This endpoint allows the deletion of an existing invoice:
          - Authentication: Requires user authentication.
          - Validation: Validate invoice ID.
          - Database Interaction: Deletes the invoice from the database.
      `,
  path: `${apiRoutes.invoice}${invoicePaths.delete}`,
  request: {
    query: deleteInvoiceSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Invoice"],

  responses: {
    200: {
      description: "Invoice deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            invoice: deleteInvoiceSchema,
          }),
        },
      },
    },
    404: {
      description: "Invoice not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
          }),
        },
      },
    },
  },
});
