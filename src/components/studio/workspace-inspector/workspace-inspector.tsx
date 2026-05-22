"use client";

import {
  ArrowRight,
  Bot,
  ChevronDown,
  Code2,
  Cpu,
  GitBranch,
  Globe,
  Info,
  MessageSquare,
  Settings2,
  X,
} from "lucide-react";

import type { SelectedWorkflowNode } from "@/components/studio/workspace-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks";
import type {
  WorkflowContextInputBinding,
  WorkflowInputBinding,
  WorkflowNodeConfig,
  WorkflowNodeIcon,
  WorkflowNodeInputDefinition,
  WorkflowNodeOutputDefinition,
  WorkflowPortValueType,
  WorkflowRefInputBinding,
  WorkflowStartInputDefinitionDraft,
  WorkflowUserInputFieldType,
} from "@/types";
import { useState } from "react";

const VARIABLE_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const UNSET_SELECT_VALUE = "__unset__";
const START_INPUT_FIELD_TYPES = [
  "text",
  "paragraph",
  "select",
  "number",
  "checkbox",
  "single_file",
  "multi_file",
  "json",
] as const satisfies readonly WorkflowUserInputFieldType[];
const START_INPUT_FIELD_TYPE_LABELS: Record<WorkflowUserInputFieldType, string> = {
  text: "Text",
  paragraph: "Paragraph",
  select: "Dropdown",
  number: "Number",
  checkbox: "Checkbox",
  single_file: "Single File",
  multi_file: "Multi File",
  json: "JSON",
};

const FIELD_TYPE_TO_VALUE_TYPE: Record<
  WorkflowUserInputFieldType,
  WorkflowPortValueType
> = {
  text: "text",
  paragraph: "text",
  select: "text",
  number: "number",
  checkbox: "boolean",
  single_file: "object",
  multi_file: "array",
  json: "json",
};

const NODE_ICONS = {
  message: MessageSquare,
  bot: Bot,
  globe: Globe,
  database: GitBranch,
  cpu: Cpu,
} as const satisfies Record<
  WorkflowNodeIcon,
  React.ComponentType<{ className?: string }>
>;

interface WorkspaceInspectorProps {
  selectedNode: SelectedWorkflowNode | null;
  onInspectNode?: (nodeId: string) => void;
  onNodeConfigChange: (
    nodeId: string,
    patch: Partial<WorkflowNodeConfig>,
  ) => void;
  onNodeLabelChange: (nodeId: string, label: string) => void;
  onNodeInputBindingChange: (
    nodeId: string,
    inputId: string,
    binding: WorkflowInputBinding | null,
  ) => void;
  onNodeInputDefinitionChange: (
    nodeId: string,
    inputId: string,
    nextDefinition: WorkflowNodeInputDefinition,
  ) => void;
  onNodeOutputDefinitionChange: (
    nodeId: string,
    outputId: string,
    nextDefinition: WorkflowNodeOutputDefinition,
  ) => void;
  onNodeInputDefinitionAdd: (
    nodeId: string,
    draft?: WorkflowStartInputDefinitionDraft,
  ) => void;
  onNodeInputDefinitionRemove: (nodeId: string, inputId: string) => void;
}

export function WorkspaceInspector({
  selectedNode,
  onInspectNode,
  onNodeConfigChange,
  onNodeLabelChange,
  onNodeInputBindingChange,
  onNodeInputDefinitionChange,
  onNodeOutputDefinitionChange,
  onNodeInputDefinitionAdd,
  onNodeInputDefinitionRemove,
}: WorkspaceInspectorProps) {
  const { t } = useI18n();
  const inspector = t.studio.editor.inspector;
  const NodeIcon = selectedNode ? NODE_ICONS[selectedNode.icon] : null;
  const [variableErrors, setVariableErrors] = useState<Record<string, string>>({});
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldId, setNewFieldId] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<WorkflowUserInputFieldType>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldMaxLength, setNewFieldMaxLength] = useState("");
  const [newFieldDefaultValue, setNewFieldDefaultValue] = useState("");
  const [newFieldDefaultBoolean, setNewFieldDefaultBoolean] =
    useState(UNSET_SELECT_VALUE);
  const [newFieldError, setNewFieldError] = useState("");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const modelValue =
    typeof selectedNode?.config.model === "string"
      ? selectedNode.config.model
      : "";
  const systemPromptValue =
    typeof selectedNode?.config.systemPrompt === "string"
      ? selectedNode.config.systemPrompt
      : "";
  const conditionExpressionValue =
    typeof selectedNode?.config.expression === "string"
      ? selectedNode.config.expression
      : "";
  const editingFieldDefinition =
    selectedNode && editingFieldId
      ? (selectedNode.inputDefinitions.find((definition) => definition.id === editingFieldId) ??
        null)
      : null;

  const getInputBinding = (inputId: string): WorkflowInputBinding | null => {
    if (!selectedNode) {
      return null;
    }

    return selectedNode.inputBindings[inputId] ?? null;
  };

  const handleBindingSourceChange = (
    inputId: string,
    source: "const" | "ref" | "context",
  ) => {
    if (!selectedNode) {
      return;
    }

    if (source === "const") {
      onNodeInputBindingChange(selectedNode.id, inputId, {
        source: "const",
        value: "",
      });
      return;
    }

    if (source === "ref") {
      onNodeInputBindingChange(selectedNode.id, inputId, {
        source: "ref",
        value: {
          nodeId: "",
          outputId: "",
        },
      });
      return;
    }

    onNodeInputBindingChange(selectedNode.id, inputId, {
      source: "context",
      value: {
        key: "",
      },
    });
  };

  const handleConstBindingValueChange = (inputId: string, value: string) => {
    if (!selectedNode) {
      return;
    }

    onNodeInputBindingChange(selectedNode.id, inputId, {
      source: "const",
      value,
    });
  };

  const handleRefBindingChange = (
    inputId: string,
    patch: Partial<WorkflowRefInputBinding["value"]>,
  ) => {
    if (!selectedNode) {
      return;
    }

    const currentBinding = getInputBinding(inputId);
    const refBinding: WorkflowRefInputBinding =
      currentBinding?.source === "ref"
        ? currentBinding
        : {
            source: "ref",
            value: {
              nodeId: "",
              outputId: "",
            },
          };

    onNodeInputBindingChange(selectedNode.id, inputId, {
      source: "ref",
      value: {
        ...refBinding.value,
        ...patch,
      },
    });
  };

  const handleContextBindingChange = (
    inputId: string,
    patch: Partial<WorkflowContextInputBinding["value"]>,
  ) => {
    if (!selectedNode) {
      return;
    }

    const currentBinding = getInputBinding(inputId);
    const contextBinding: WorkflowContextInputBinding =
      currentBinding?.source === "context"
        ? currentBinding
        : {
            source: "context",
            value: {
              key: "",
            },
          };

    onNodeInputBindingChange(selectedNode.id, inputId, {
      source: "context",
      value: {
        ...contextBinding.value,
        ...patch,
      },
    });
  };

  const handleInputVariableIdCommit = (inputId: string, nextId: string) => {
    if (!selectedNode) {
      return;
    }

    const trimmedNextId = nextId.trim();
    const errorKey = `${selectedNode.id}:input:${inputId}`;
    if (!VARIABLE_NAME_PATTERN.test(trimmedNextId)) {
      setVariableErrors((previous) => ({
        ...previous,
        [errorKey]: "Variable name must match [A-Za-z_][A-Za-z0-9_]*",
      }));
      return;
    }

    const duplicated = selectedNode.inputDefinitions.some(
      (definition) => definition.id !== inputId && definition.id === trimmedNextId,
    );
    if (duplicated) {
      setVariableErrors((previous) => ({
        ...previous,
        [errorKey]: "Variable name already exists in this node.",
      }));
      return;
    }

    const targetDefinition = selectedNode.inputDefinitions.find(
      (definition) => definition.id === inputId,
    );
    if (!targetDefinition) {
      return;
    }

    setVariableErrors((previous) => {
      const next = { ...previous };
      delete next[errorKey];
      return next;
    });
    onNodeInputDefinitionChange(selectedNode.id, inputId, {
      ...targetDefinition,
      id: trimmedNextId,
      label: targetDefinition.label || trimmedNextId,
    });
  };

  const handleOutputVariableIdCommit = (outputId: string, nextId: string) => {
    if (!selectedNode) {
      return;
    }

    const trimmedNextId = nextId.trim();
    const errorKey = `${selectedNode.id}:output:${outputId}`;
    if (!VARIABLE_NAME_PATTERN.test(trimmedNextId)) {
      setVariableErrors((previous) => ({
        ...previous,
        [errorKey]: "Variable name must match [A-Za-z_][A-Za-z0-9_]*",
      }));
      return;
    }

    const duplicated = selectedNode.outputDefinitions.some(
      (definition) => definition.id !== outputId && definition.id === trimmedNextId,
    );
    if (duplicated) {
      setVariableErrors((previous) => ({
        ...previous,
        [errorKey]: "Variable name already exists in this node.",
      }));
      return;
    }

    const targetDefinition = selectedNode.outputDefinitions.find(
      (definition) => definition.id === outputId,
    );
    if (!targetDefinition) {
      return;
    }

    setVariableErrors((previous) => {
      const next = { ...previous };
      delete next[errorKey];
      return next;
    });
    onNodeOutputDefinitionChange(selectedNode.id, outputId, {
      ...targetDefinition,
      id: trimmedNextId,
      label: targetDefinition.label || trimmedNextId,
    });
  };

  const handleStartInputFieldTypeChange = (
    inputDefinition: WorkflowNodeInputDefinition,
    fieldType: WorkflowUserInputFieldType,
  ) => {
    if (!selectedNode) {
      return;
    }

    const valueType = FIELD_TYPE_TO_VALUE_TYPE[fieldType];
    const nextDefinition: WorkflowNodeInputDefinition = {
      ...inputDefinition,
      fieldType,
      valueType,
    };
    nextDefinition.maxLength = undefined;
    nextDefinition.min = undefined;
    nextDefinition.max = undefined;
    nextDefinition.step = undefined;
    nextDefinition.options = undefined;
    nextDefinition.acceptedFileTypes = undefined;
    nextDefinition.maxFileSizeMb = undefined;
    nextDefinition.maxFiles = undefined;

    if (fieldType === "text" || fieldType === "paragraph") {
      nextDefinition.defaultValue =
        typeof inputDefinition.defaultValue === "string"
          ? inputDefinition.defaultValue
          : undefined;
      nextDefinition.schema = {
        type: "string",
      };
    } else if (fieldType === "select") {
      nextDefinition.options =
        inputDefinition.options?.map((option) => ({ ...option })) ?? [];
      nextDefinition.defaultValue =
        typeof inputDefinition.defaultValue === "string"
          ? inputDefinition.defaultValue
          : undefined;
      nextDefinition.schema = {
        type: "string",
      };
    } else if (fieldType === "number") {
      nextDefinition.defaultValue =
        typeof inputDefinition.defaultValue === "number"
          ? inputDefinition.defaultValue
          : undefined;
      nextDefinition.schema = {
        type: "number",
      };
    } else if (fieldType === "checkbox") {
      nextDefinition.defaultValue =
        typeof inputDefinition.defaultValue === "boolean"
          ? inputDefinition.defaultValue
          : undefined;
      nextDefinition.schema = {
        type: "boolean",
      };
    } else if (fieldType === "single_file") {
      nextDefinition.defaultValue = undefined;
      nextDefinition.schema = {
        type: "object",
      };
    } else if (fieldType === "multi_file") {
      nextDefinition.defaultValue = undefined;
      nextDefinition.schema = {
        type: "array",
      };
    } else {
      nextDefinition.defaultValue =
        typeof inputDefinition.defaultValue === "string"
          ? inputDefinition.defaultValue
          : undefined;
      nextDefinition.schema = {
        type: "object",
      };
    }

    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, nextDefinition);
  };

  const handleStartInputMaxLengthChange = (
    inputDefinition: WorkflowNodeInputDefinition,
    rawValue: string,
  ) => {
    if (!selectedNode) {
      return;
    }

    const trimmed = rawValue.trim();
    const parsed = Number.parseInt(trimmed, 10);
    const nextMaxLength =
      trimmed.length === 0 || !Number.isFinite(parsed) || parsed <= 0
        ? undefined
        : parsed;

    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      maxLength: nextMaxLength,
      schema: {
        type: "string",
        ...(nextMaxLength ? { maxLength: nextMaxLength } : {}),
      },
    });
  };

  const handleStartInputDefaultValueChange = (
    inputDefinition: WorkflowNodeInputDefinition,
    nextRawValue: string,
  ) => {
    if (!selectedNode) {
      return;
    }

    const fieldType = inputDefinition.fieldType ?? "text";
    if (fieldType === "number") {
      const nextNumber = Number(nextRawValue);
      onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
        ...inputDefinition,
        defaultValue: Number.isFinite(nextNumber) ? nextNumber : undefined,
        schema: {
          type: "number",
          ...(Number.isFinite(nextNumber) ? { default: nextNumber } : {}),
        },
      });
      return;
    }

    if (fieldType === "checkbox") {
      const nextBoolean =
        nextRawValue === "true" ? true : nextRawValue === "false" ? false : undefined;
      onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
        ...inputDefinition,
        defaultValue: nextBoolean,
        schema: {
          type: "boolean",
          ...(nextBoolean !== undefined ? { default: nextBoolean } : {}),
        },
      });
      return;
    }

    if (fieldType === "text" || fieldType === "paragraph" || fieldType === "select") {
      onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
        ...inputDefinition,
        defaultValue: nextRawValue.length > 0 ? nextRawValue : undefined,
        schema: {
          type: "string",
          ...(nextRawValue.length > 0 ? { default: nextRawValue } : {}),
          ...(typeof inputDefinition.maxLength === "number" && inputDefinition.maxLength > 0
            ? { maxLength: inputDefinition.maxLength }
            : {}),
        },
      });
      return;
    }

    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      defaultValue: nextRawValue.length > 0 ? nextRawValue : undefined,
      schema: {
        type: fieldType === "json" ? "object" : "string",
        ...(nextRawValue.length > 0 ? { default: nextRawValue } : {}),
      },
    });
  };

  const handleStartInputNumberConstraintChange = (
    inputDefinition: WorkflowNodeInputDefinition,
    key: "min" | "max" | "step",
    rawValue: string,
  ) => {
    if (!selectedNode) {
      return;
    }

    const trimmed = rawValue.trim();
    const parsed = Number(trimmed);
    const nextValue =
      trimmed.length === 0 || !Number.isFinite(parsed) ? undefined : parsed;
    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      [key]: key === "step" && nextValue !== undefined && nextValue <= 0 ? undefined : nextValue,
      schema: {
        type: "number",
        ...(key === "min" && nextValue !== undefined ? { minimum: nextValue } : {}),
        ...(key === "max" && nextValue !== undefined ? { maximum: nextValue } : {}),
      },
    });
  };

  const handleStartInputOptionsChange = (
    inputDefinition: WorkflowNodeInputDefinition,
    index: number,
    key: "label" | "value",
    value: string,
  ) => {
    if (!selectedNode) {
      return;
    }

    const previousOptions = inputDefinition.options ?? [];
    if (index < 0 || index >= previousOptions.length) {
      return;
    }

    const nextOptions = previousOptions.map((option, optionIndex) =>
      optionIndex === index
        ? {
            ...option,
            [key]: value,
          }
        : option,
    );

    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      options: nextOptions,
    });
  };

  const handleStartInputOptionAdd = (inputDefinition: WorkflowNodeInputDefinition) => {
    if (!selectedNode) {
      return;
    }

    const previousOptions = inputDefinition.options ?? [];
    const nextOptions = [
      ...previousOptions,
      {
        label: "",
        value: "",
      },
    ];

    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      options: nextOptions,
    });
  };

  const handleStartInputOptionRemove = (
    inputDefinition: WorkflowNodeInputDefinition,
    index: number,
  ) => {
    if (!selectedNode) {
      return;
    }

    const previousOptions = inputDefinition.options ?? [];
    if (index < 0 || index >= previousOptions.length) {
      return;
    }

    const nextOptions = previousOptions.filter((_, optionIndex) => optionIndex !== index);
    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      options: nextOptions,
    });
  };

  const handleStartInputAcceptedTypesChange = (
    inputDefinition: WorkflowNodeInputDefinition,
    rawValue: string,
  ) => {
    if (!selectedNode) {
      return;
    }

    const tokens = rawValue
      .split(",")
      .map((token) => token.trim())
      .filter((token) => token.length > 0);

    onNodeInputDefinitionChange(selectedNode.id, inputDefinition.id, {
      ...inputDefinition,
      acceptedFileTypes: tokens.length > 0 ? tokens : undefined,
    });
  };

  const buildNextStartInputId = () => {
    if (!selectedNode) {
      return "sys_input_1";
    }

    const existingIds = new Set(selectedNode.inputDefinitions.map((definition) => definition.id));
    let sequence = selectedNode.inputDefinitions.length + 1;
    let nextId = `sys_input_${sequence}`;
    while (existingIds.has(nextId)) {
      sequence += 1;
      nextId = `sys_input_${sequence}`;
    }

    return nextId;
  };

  const resetAddFieldDraft = () => {
    const nextId = buildNextStartInputId();
    setNewFieldId(nextId);
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(false);
    setNewFieldMaxLength("");
    setNewFieldDefaultValue("");
    setNewFieldDefaultBoolean(UNSET_SELECT_VALUE);
    setNewFieldError("");
  };

  const handleOpenAddFieldModal = () => {
    resetAddFieldDraft();
    setIsAddFieldModalOpen(true);
  };

  const handleNewFieldTypeChange = (fieldType: WorkflowUserInputFieldType) => {
    setNewFieldType(fieldType);
    if (fieldType !== "text" && fieldType !== "paragraph") {
      setNewFieldMaxLength("");
    }
    if (fieldType === "checkbox") {
      setNewFieldDefaultValue("");
    } else if (fieldType === "single_file" || fieldType === "multi_file") {
      setNewFieldDefaultBoolean(UNSET_SELECT_VALUE);
      setNewFieldDefaultValue("");
    } else {
      setNewFieldDefaultBoolean(UNSET_SELECT_VALUE);
    }
  };

  const handleCloseAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
    setNewFieldError("");
  };

  const handleOpenEditFieldModal = (inputId: string) => {
    setEditingFieldId(inputId);
  };

  const handleCloseEditFieldModal = () => {
    setEditingFieldId(null);
  };

  const handleAddFieldSubmit = () => {
    if (!selectedNode) {
      return;
    }

    const nextFieldId = newFieldId.trim();
    if (!VARIABLE_NAME_PATTERN.test(nextFieldId)) {
      setNewFieldError("Variable name must match [A-Za-z_][A-Za-z0-9_]*");
      return;
    }

    const duplicated = selectedNode.inputDefinitions.some(
      (definition) => definition.id === nextFieldId,
    );
    if (duplicated) {
      setNewFieldError("Variable name already exists in this node.");
      return;
    }

    onNodeInputDefinitionAdd(selectedNode.id, {
      id: nextFieldId,
      label: newFieldLabel.trim() || nextFieldId,
      fieldType: newFieldType,
      required: newFieldRequired,
      ...(newFieldType === "text" || newFieldType === "paragraph"
        ? (() => {
            const parsed = Number.parseInt(newFieldMaxLength.trim(), 10);
            const nextMaxLength =
              Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
            return nextMaxLength ? { maxLength: nextMaxLength } : {};
          })()
        : {}),
      ...(newFieldType === "checkbox"
        ? {
            defaultValue:
              newFieldDefaultBoolean === "true"
                ? true
                : newFieldDefaultBoolean === "false"
                  ? false
                  : undefined,
          }
        : newFieldType === "number"
          ? (() => {
              const parsed = Number(newFieldDefaultValue);
              return Number.isFinite(parsed) ? { defaultValue: parsed } : {};
            })()
          : newFieldType === "single_file" || newFieldType === "multi_file"
            ? {}
            : newFieldDefaultValue.trim().length > 0
              ? { defaultValue: newFieldDefaultValue }
              : {}),
    });
    setIsAddFieldModalOpen(false);
    setNewFieldError("");
  };

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-bold">{inspector.title}</span>
        </div>
        <button
          type="button"
          className="rounded-md p-1 text-gray-300"
          aria-label="Close inspector"
          disabled
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {!selectedNode || !NodeIcon ? (
        <div className="p-5">
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
            Select one node on canvas to inspect its configuration.
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-5">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className={`rounded-lg p-2 text-white ${selectedNode.color}`}>
              <NodeIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">{selectedNode.label}</h4>
              <p className="text-xs text-gray-500">
                {selectedNode.displayName}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                {selectedNode.id}
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-gray-100 p-3 text-xs text-gray-500">
            <label className="space-y-2 text-xs font-bold text-gray-500 uppercase">
              Node Label
              <input
                type="text"
                className="mt-2 mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 normal-case focus:ring-1 focus:ring-black/5 focus:outline-none"
                value={selectedNode.label}
                onChange={(event) =>
                  onNodeLabelChange(selectedNode.id, event.target.value)
                }
              />
            </label>
            <p>
              Type:{" "}
              <span className="font-medium text-gray-800">
                {selectedNode.type}
              </span>
            </p>
            <p>
              Category:{" "}
              <span className="font-medium text-gray-800">
                {selectedNode.category}
              </span>
            </p>
            {selectedNode.description ? (
              <p>{selectedNode.description}</p>
            ) : null}
          </div>

          <div className="space-y-2 rounded-xl border border-gray-100 p-3">
            <p className="text-xs font-bold text-gray-500 uppercase">Next Nodes</p>
            {selectedNode.nextNodes.length === 0 ? (
              <p className="text-xs text-gray-500">No outgoing node connected.</p>
            ) : (
              <div className="space-y-2">
                {selectedNode.nextNodes.map((nextNode) => {
                  const NextNodeIcon = NODE_ICONS[nextNode.icon];

                  return (
                    <button
                      key={nextNode.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left transition-colors hover:bg-gray-50"
                      onClick={() => onInspectNode?.(nextNode.id)}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`rounded-md p-1 text-white ${nextNode.color}`}>
                          <NextNodeIcon className="h-3.5 w-3.5" />
                        </span>
                        <span className="truncate text-sm font-medium text-gray-900">
                          {nextNode.label}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedNode.type === "llm_call" ? (
            <>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  {inspector.model}
                  <Info className="h-3 w-3" />
                </label>
                <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                  <input
                    type="text"
                    className="w-full text-sm focus:outline-none"
                    value={modelValue}
                    placeholder={inspector.modelValue}
                    onChange={(event) =>
                      onNodeConfigChange(selectedNode.id, {
                        model: event.target.value,
                      })
                    }
                  />
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  {inspector.systemPrompt}
                </label>
                <textarea
                  className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed focus:ring-1 focus:ring-black/5 focus:outline-none"
                  placeholder={inspector.promptPlaceholder}
                  value={systemPromptValue}
                  onChange={(event) =>
                    onNodeConfigChange(selectedNode.id, {
                      systemPrompt: event.target.value,
                    })
                  }
                />
              </div>
            </>
          ) : null}

          {selectedNode.type === "start" ? (
            <div className="space-y-3 rounded-xl border border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-500 uppercase">
                  User Input Fields
                </div>
                <button
                  type="button"
                  className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
                  onClick={handleOpenAddFieldModal}
                >
                  Add Field
                </button>
              </div>
              {selectedNode.inputDefinitions.map((inputDefinition) => {
                const inputErrorKey = `${selectedNode.id}:input:${inputDefinition.id}`;
                const fieldType = inputDefinition.fieldType ?? "text";
                const canRemove = selectedNode.inputDefinitions.length > 0;

                return (
                  <div
                    key={inputDefinition.id}
                    className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] font-semibold text-gray-700">
                        {inputDefinition.label}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-white"
                          onClick={() => handleOpenEditFieldModal(inputDefinition.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() =>
                            onNodeInputDefinitionRemove(selectedNode.id, inputDefinition.id)
                          }
                          disabled={!canRemove}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <p className="text-gray-500">
                        Nickname:{" "}
                        <span className="font-semibold text-gray-700">
                          {inputDefinition.label}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Variable:{" "}
                        <span className="font-semibold text-gray-700">
                          {inputDefinition.id}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Required:{" "}
                        <span className="font-semibold text-gray-700">
                          {inputDefinition.required ? "Yes" : "No"}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Type:{" "}
                        <span className="font-semibold text-gray-700">
                          {START_INPUT_FIELD_TYPE_LABELS[fieldType]}
                        </span>
                      </p>
                    </div>

                    {variableErrors[inputErrorKey] ? (
                      <p className="text-[11px] text-red-600">
                        {variableErrors[inputErrorKey]}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <Dialog
                open={isAddFieldModalOpen}
                onOpenChange={(nextOpen) => {
                  if (!nextOpen) {
                    handleCloseAddFieldModal();
                  }
                }}
              >
                <DialogContent className="p-5">
                  <DialogHeader>
                    <DialogTitle>Add Input Variable</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                      Field Type
                    </label>
                    <Select
                      value={newFieldType}
                      onValueChange={(value) =>
                        handleNewFieldTypeChange(value as WorkflowUserInputFieldType)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {START_INPUT_FIELD_TYPES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {START_INPUT_FIELD_TYPE_LABELS[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                      Variable Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                      value={newFieldId}
                      placeholder="snake_case variable"
                      onChange={(event) => {
                        setNewFieldId(event.target.value);
                        if (newFieldError) {
                          setNewFieldError("");
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                      Nickname
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                      value={newFieldLabel}
                      placeholder="Display name"
                      onChange={(event) => setNewFieldLabel(event.target.value)}
                    />
                  </div>
                  {newFieldType === "text" || newFieldType === "paragraph" ? (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                        Max Length
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                        value={newFieldMaxLength}
                        onChange={(event) => setNewFieldMaxLength(event.target.value)}
                      />
                    </div>
                  ) : null}
                  {newFieldType !== "single_file" && newFieldType !== "multi_file" ? (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                        Default Value
                      </label>
                      {newFieldType === "checkbox" ? (
                        <Select
                          value={newFieldDefaultBoolean}
                          onValueChange={setNewFieldDefaultBoolean}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UNSET_SELECT_VALUE}>Unset</SelectItem>
                            <SelectItem value="false">false</SelectItem>
                            <SelectItem value="true">true</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : newFieldType === "json" ? (
                        <textarea
                          className="mt-1 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          placeholder='e.g. {"foo":"bar"}'
                          value={newFieldDefaultValue}
                          onChange={(event) => setNewFieldDefaultValue(event.target.value)}
                        />
                      ) : (
                        <input
                          type={newFieldType === "number" ? "number" : "text"}
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          value={newFieldDefaultValue}
                          onChange={(event) => setNewFieldDefaultValue(event.target.value)}
                        />
                      )}
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-600 uppercase">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(event) => setNewFieldRequired(event.target.checked)}
                    />
                    Required
                  </label>
                  {newFieldError ? (
                    <p className="text-[11px] text-red-600">{newFieldError}</p>
                  ) : null}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50"
                      onClick={handleCloseAddFieldModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-gray-900 px-3 py-1.5 text-[11px] text-white hover:bg-black"
                      onClick={handleAddFieldSubmit}
                    >
                      Add
                    </button>
                  </div>
                </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={Boolean(editingFieldDefinition)}
                onOpenChange={(nextOpen) => {
                  if (!nextOpen) {
                    handleCloseEditFieldModal();
                  }
                }}
              >
                <DialogContent className="p-5">
                  <DialogHeader>
                    <DialogTitle>Edit Input Variable</DialogTitle>
                  </DialogHeader>
                  {editingFieldDefinition ? (
                    (() => {
                      const inputDefinition = editingFieldDefinition;
                      const fieldType = inputDefinition.fieldType ?? "text";
                      const defaultValue =
                        inputDefinition.defaultValue === undefined
                          ? ""
                          : String(inputDefinition.defaultValue);
                      const inputErrorKey = `${selectedNode.id}:input:${inputDefinition.id}`;

                      return (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                              Field Type
                            </label>
                            <Select
                              value={fieldType}
                              onValueChange={(value) =>
                                handleStartInputFieldTypeChange(
                                  inputDefinition,
                                  value as WorkflowUserInputFieldType,
                                )
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {START_INPUT_FIELD_TYPES.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {START_INPUT_FIELD_TYPE_LABELS[option]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                              Variable Name
                            </label>
                            <input
                              key={`start-input-name-modal-${selectedNode.id}-${inputDefinition.id}`}
                              type="text"
                              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                              defaultValue={inputDefinition.id}
                              placeholder="snake_case variable"
                              onBlur={(event) =>
                                handleInputVariableIdCommit(
                                  inputDefinition.id,
                                  event.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                              Nickname
                            </label>
                            <input
                              type="text"
                              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                              value={inputDefinition.label}
                              placeholder="Display name"
                              onChange={(event) =>
                                onNodeInputDefinitionChange(
                                  selectedNode.id,
                                  inputDefinition.id,
                                  {
                                    ...inputDefinition,
                                    label: event.target.value,
                                  },
                                )
                              }
                            />
                          </div>

                          {fieldType === "text" || fieldType === "paragraph" ? (
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                Max Length
                              </label>
                              <input
                                type="number"
                                min={1}
                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                defaultValue={inputDefinition.maxLength ?? ""}
                                onBlur={(event) =>
                                  handleStartInputMaxLengthChange(
                                    inputDefinition,
                                    event.target.value,
                                  )
                                }
                              />
                            </div>
                          ) : null}

                          {fieldType === "number" ? (
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                  Min
                                </label>
                                <input
                                  type="number"
                                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                  defaultValue={inputDefinition.min ?? ""}
                                  onBlur={(event) =>
                                    handleStartInputNumberConstraintChange(
                                      inputDefinition,
                                      "min",
                                      event.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                  Max
                                </label>
                                <input
                                  type="number"
                                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                  defaultValue={inputDefinition.max ?? ""}
                                  onBlur={(event) =>
                                    handleStartInputNumberConstraintChange(
                                      inputDefinition,
                                      "max",
                                      event.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                  Step
                                </label>
                                <input
                                  type="number"
                                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                  defaultValue={inputDefinition.step ?? ""}
                                  onBlur={(event) =>
                                    handleStartInputNumberConstraintChange(
                                      inputDefinition,
                                      "step",
                                      event.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ) : null}

                          {fieldType === "select" ? (
                            <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-gray-500 uppercase">
                                  Options
                                </label>
                                <button
                                  type="button"
                                  className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
                                  onClick={() => handleStartInputOptionAdd(inputDefinition)}
                                >
                                  Add Option
                                </button>
                              </div>
                              {(inputDefinition.options ?? []).map((option, optionIndex) => (
                                <div
                                  key={`${inputDefinition.id}-opt-modal-${optionIndex}`}
                                  className="grid grid-cols-[1fr_1fr_auto] gap-2"
                                >
                                  <input
                                    type="text"
                                    className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                    placeholder="Label"
                                    value={option.label}
                                    onChange={(event) =>
                                      handleStartInputOptionsChange(
                                        inputDefinition,
                                        optionIndex,
                                        "label",
                                        event.target.value,
                                      )
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                    placeholder="Value"
                                    value={option.value}
                                    onChange={(event) =>
                                      handleStartInputOptionsChange(
                                        inputDefinition,
                                        optionIndex,
                                        "value",
                                        event.target.value,
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="rounded-md border border-gray-200 px-2 py-2 text-[11px] text-gray-600 hover:bg-gray-50"
                                    onClick={() =>
                                      handleStartInputOptionRemove(
                                        inputDefinition,
                                        optionIndex,
                                      )
                                    }
                                  >
                                    Del
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {fieldType === "single_file" || fieldType === "multi_file" ? (
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                  Accepted Types
                                </label>
                                <input
                                  type="text"
                                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                  placeholder="e.g. .pdf,.docx,image/*"
                                  defaultValue={(inputDefinition.acceptedFileTypes ?? []).join(
                                    ",",
                                  )}
                                  onBlur={(event) =>
                                    handleStartInputAcceptedTypesChange(
                                      inputDefinition,
                                      event.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                    Max Size (MB)
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                    defaultValue={inputDefinition.maxFileSizeMb ?? ""}
                                    onBlur={(event) => {
                                      const parsed = Number(event.target.value);
                                      onNodeInputDefinitionChange(
                                        selectedNode.id,
                                        inputDefinition.id,
                                        {
                                          ...inputDefinition,
                                          maxFileSizeMb:
                                            Number.isFinite(parsed) && parsed > 0
                                              ? parsed
                                              : undefined,
                                        },
                                      );
                                    }}
                                  />
                                </div>
                                {fieldType === "multi_file" ? (
                                  <div>
                                    <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                      Max Files
                                    </label>
                                    <input
                                      type="number"
                                      min={1}
                                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                      defaultValue={inputDefinition.maxFiles ?? ""}
                                      onBlur={(event) => {
                                        const parsed = Number.parseInt(
                                          event.target.value,
                                          10,
                                        );
                                        onNodeInputDefinitionChange(
                                          selectedNode.id,
                                          inputDefinition.id,
                                          {
                                            ...inputDefinition,
                                            maxFiles:
                                              Number.isFinite(parsed) && parsed > 0
                                                ? parsed
                                                : undefined,
                                          },
                                        );
                                      }}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}

                          {fieldType !== "single_file" && fieldType !== "multi_file" ? (
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                                Default Value
                              </label>
                              {fieldType === "checkbox" ? (
                                <Select
                                  value={
                                    inputDefinition.defaultValue === true
                                      ? "true"
                                      : inputDefinition.defaultValue === false
                                        ? "false"
                                        : UNSET_SELECT_VALUE
                                  }
                                  onValueChange={(value) =>
                                    handleStartInputDefaultValueChange(
                                      inputDefinition,
                                      value === UNSET_SELECT_VALUE ? "" : value,
                                    )
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={UNSET_SELECT_VALUE}>Unset</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                    <SelectItem value="true">true</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : fieldType === "json" ? (
                                <textarea
                                  className="mt-1 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                  placeholder='e.g. {"foo":"bar"}'
                                  value={defaultValue}
                                  onChange={(event) =>
                                    handleStartInputDefaultValueChange(
                                      inputDefinition,
                                      event.target.value,
                                    )
                                  }
                                />
                              ) : (
                                <input
                                  type={fieldType === "number" ? "number" : "text"}
                                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                                  value={defaultValue}
                                  onChange={(event) =>
                                    handleStartInputDefaultValueChange(
                                      inputDefinition,
                                      event.target.value,
                                    )
                                  }
                                />
                              )}
                            </div>
                          ) : null}

                          <label className="flex items-center gap-2 text-[11px] font-semibold text-gray-600 uppercase">
                            <input
                              type="checkbox"
                              checked={Boolean(inputDefinition.required)}
                              onChange={(event) =>
                                onNodeInputDefinitionChange(
                                  selectedNode.id,
                                  inputDefinition.id,
                                  {
                                    ...inputDefinition,
                                    required: event.target.checked,
                                  },
                                )
                              }
                            />
                            Required
                          </label>

                          {variableErrors[inputErrorKey] ? (
                            <p className="text-[11px] text-red-600">
                              {variableErrors[inputErrorKey]}
                            </p>
                          ) : null}

                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="rounded-md border border-gray-200 px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50"
                              onClick={handleCloseEditFieldModal}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : null}
                </DialogContent>
              </Dialog>
            </div>
          ) : null}

          {selectedNode.type !== "start" && selectedNode.inputDefinitions.length > 0 ? (
            <div className="space-y-3 rounded-xl border border-gray-100 p-3">
              <div className="text-xs font-bold text-gray-500 uppercase">
                Input Bindings
              </div>
              {selectedNode.inputDefinitions.map((inputDefinition) => {
                const binding = getInputBinding(inputDefinition.id);
                const source = binding?.source ?? "ref";
                const inputErrorKey = `${selectedNode.id}:input:${inputDefinition.id}`;

                return (
                  <div
                    key={inputDefinition.id}
                    className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          {inputDefinition.label}
                          {inputDefinition.required ? (
                            <span className="ml-1 text-red-500">*</span>
                          ) : null}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {inputDefinition.id} | {inputDefinition.valueType}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-white"
                        onClick={() =>
                          onNodeInputBindingChange(
                            selectedNode.id,
                            inputDefinition.id,
                            null,
                          )
                        }
                      >
                        Clear
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                          Variable Name
                        </label>
                        <input
                          key={`input-name-${selectedNode.id}-${inputDefinition.id}`}
                          type="text"
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          defaultValue={inputDefinition.id}
                          placeholder="snake_case variable"
                          onBlur={(event) =>
                            handleInputVariableIdCommit(
                              inputDefinition.id,
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                          Nickname
                        </label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          value={inputDefinition.label}
                          placeholder="Display name"
                          onChange={(event) =>
                            onNodeInputDefinitionChange(
                              selectedNode.id,
                              inputDefinition.id,
                              {
                                ...inputDefinition,
                                label: event.target.value,
                              },
                            )
                          }
                        />
                      </div>
                      {variableErrors[inputErrorKey] ? (
                        <p className="text-[11px] text-red-600">
                          {variableErrors[inputErrorKey]}
                        </p>
                      ) : null}
                    </div>

                    <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                      Source
                    </label>
                    <Select
                      value={source}
                      onValueChange={(value) =>
                        handleBindingSourceChange(
                          inputDefinition.id,
                          value as "const" | "ref" | "context",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ref">Node Output</SelectItem>
                        <SelectItem value="const">Constant</SelectItem>
                        <SelectItem value="context">Runtime Context</SelectItem>
                      </SelectContent>
                    </Select>

                    {source === "const" ? (
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                        placeholder="Constant value"
                        value={
                          binding?.source === "const"
                            ? String(binding.value ?? "")
                            : ""
                        }
                        onChange={(event) =>
                          handleConstBindingValueChange(
                            inputDefinition.id,
                            event.target.value,
                          )
                        }
                      />
                    ) : null}

                    {source === "ref" ? (
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          placeholder="Source node id"
                          value={
                            binding?.source === "ref" ? binding.value.nodeId : ""
                          }
                          onChange={(event) =>
                            handleRefBindingChange(inputDefinition.id, {
                              nodeId: event.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          placeholder="Output id"
                          value={
                            binding?.source === "ref" ? binding.value.outputId : ""
                          }
                          onChange={(event) =>
                            handleRefBindingChange(inputDefinition.id, {
                              outputId: event.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          placeholder="Optional JSON path"
                          value={
                            binding?.source === "ref" ? (binding.value.path ?? "") : ""
                          }
                          onChange={(event) =>
                            handleRefBindingChange(inputDefinition.id, {
                              path: event.target.value,
                            })
                          }
                        />
                      </div>
                    ) : null}

                    {source === "context" ? (
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          placeholder="Context key"
                          value={
                            binding?.source === "context" ? binding.value.key : ""
                          }
                          onChange={(event) =>
                            handleContextBindingChange(inputDefinition.id, {
                              key: event.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                          placeholder="Optional JSON path"
                          value={
                            binding?.source === "context"
                              ? (binding.value.path ?? "")
                              : ""
                          }
                          onChange={(event) =>
                            handleContextBindingChange(inputDefinition.id, {
                              path: event.target.value,
                            })
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {selectedNode.outputDefinitions.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs font-bold text-gray-500 uppercase">
                Outputs
              </div>
              {selectedNode.type === "start" ? (
                <p className="text-[11px] text-gray-500">
                  Start outputs are derived from input field variables.
                </p>
              ) : null}
              {selectedNode.outputDefinitions.map((outputDefinition) => {
                const outputErrorKey = `${selectedNode.id}:output:${outputDefinition.id}`;

                return (
                  <div
                    key={outputDefinition.id}
                    className="space-y-2 rounded-lg border border-gray-100 bg-white p-3"
                  >
                    <p className="text-[11px] text-gray-500">
                      {outputDefinition.valueType}
                    </p>
                    {selectedNode.type === "start" ? (
                      <div className="space-y-1 text-[12px] text-gray-700">
                        <p>
                          Variable Name:{" "}
                          <span className="font-semibold">{outputDefinition.id}</span>
                        </p>
                        <p>
                          Nickname:{" "}
                          <span className="font-semibold">{outputDefinition.label}</span>
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                            Variable Name
                          </label>
                          <input
                            key={`output-name-${selectedNode.id}-${outputDefinition.id}`}
                            type="text"
                            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                            defaultValue={outputDefinition.id}
                            placeholder="snake_case variable"
                            onBlur={(event) =>
                              handleOutputVariableIdCommit(
                                outputDefinition.id,
                                event.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase">
                            Nickname
                          </label>
                          <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-black/5 focus:outline-none"
                            value={outputDefinition.label}
                            placeholder="Display name"
                            onChange={(event) =>
                              onNodeOutputDefinitionChange(
                                selectedNode.id,
                                outputDefinition.id,
                                {
                                  ...outputDefinition,
                                  label: event.target.value,
                                },
                              )
                            }
                          />
                        </div>
                        {variableErrors[outputErrorKey] ? (
                          <p className="text-[11px] text-red-600">
                            {variableErrors[outputErrorKey]}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {selectedNode.type === "condition" ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Condition Expression
              </label>
              <textarea
                className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed focus:ring-1 focus:ring-black/5 focus:outline-none"
                placeholder="e.g. {{intent}} === 'purchase'"
                value={conditionExpressionValue}
                onChange={(event) =>
                  onNodeConfigChange(selectedNode.id, {
                    expression: event.target.value,
                  })
                }
              />
              <p className="text-xs text-gray-500">
                True/False branches are controlled by this expression.
              </p>
            </div>
          ) : null}

          {selectedNode.type === "start" ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              Start node is the workflow entry point. It should have outgoing
              control edges.
            </div>
          ) : null}

          {selectedNode.type === "end" ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              End node terminates this workflow path. It should only receive
              incoming edges.
            </div>
          ) : null}

          {selectedNode.type !== "llm_call" &&
          selectedNode.type !== "condition" &&
          selectedNode.type !== "start" &&
          selectedNode.type !== "end" ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              No custom inspector form registered for this node type yet.
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-auto border-t border-gray-100 p-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100"
          disabled={!selectedNode}
        >
          <Code2 className="h-4 w-4" />
          {inspector.exportJson}
        </button>
      </div>
    </aside>
  );
}
