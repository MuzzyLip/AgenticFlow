# Workflow DSL (Cross-language Contract)

## Source of truth
- JSON Schema: `schemas/workflow/workflow-document-1.0.0.schema.json`
- Frontend TS type: `src/types/workflow.ts`

## Versioning
- Current schema version: `1.0.0`
- Persisted payload must carry `schemaVersion`.
- Future incompatible changes must bump major version and publish a new schema file.

## Field mapping (TS <-> JSON Schema)
- `schemaVersion` <-> `schemaVersion`
- `workflowId` <-> `workflowId`
- `meta.createdAt` <-> `meta.createdAt`
- `meta.updatedAt` <-> `meta.updatedAt`
- `graph.nodes[].config` <-> `graph.nodes[].config`
- `graph.edges[].source.nodeId` <-> `graph.edges[].source.nodeId`

## Validation rules
- Runtime payload validation uses JSON Schema.
- Semantic constraints (required business fields, enum compatibility, `viewport.zoom >= 0.1`) should still be validated in service logic.

## Notes for Rust backend
- Recommended JSON Schema validator: `jsonschema` crate.
- When accepting JSON payloads from web clients, validate against JSON Schema first, then map to domain structs.
