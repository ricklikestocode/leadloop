import React, { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  value?: number;
  pipelineStage: string;
}

interface DragDropPipelineProps {
  stages: string[];
  leads: Record<string, Lead[]>;
  onStageMoved?: (leadId: string, fromStage: string, toStage: string) => void;
  onLeadClick?: (leadId: string) => void;
  onDeleteLead?: (leadId: string) => void;
}

export function DragDropPipeline({
  stages,
  leads,
  onStageMoved,
  onLeadClick,
  onDeleteLead,
}: DragDropPipelineProps) {
  const [draggedItem, setDraggedItem] = useState<{ leadId: string; fromStage: string } | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string, stage: string) => {
    setDraggedItem({ leadId, fromStage: stage });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toStage: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.fromStage !== toStage) {
      onStageMoved?.(draggedItem.leadId, draggedItem.fromStage, toStage);
    }
    setDraggedItem(null);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-gray-100 border-gray-300",
      CONTACTED: "bg-blue-50 border-blue-300",
      INTERESTED: "bg-purple-50 border-purple-300",
      NEGOTIATION: "bg-yellow-50 border-yellow-300",
      WON: "bg-green-50 border-green-300",
      LOST: "bg-red-50 border-red-300",
    };
    return colors[stage] || "bg-gray-100 border-gray-300";
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map((stage) => (
          <div
            key={stage}
            className={`flex-shrink-0 w-80 rounded-lg border-2 p-4 ${getStageColor(stage)}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{stage}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                {leads[stage]?.length || 0}
              </span>
            </div>

            <div className="space-y-2">
              {leads[stage]?.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id, stage)}
                  onClick={() => onLeadClick?.(lead.id)}
                  className="bg-white rounded-lg p-3 shadow cursor-move hover:shadow-md transition-shadow group border border-gray-200"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-500 truncate">{lead.company}</p>
                      )}
                      {lead.value && (
                        <p className="text-xs font-semibold text-green-600 mt-1">
                          ${lead.value.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {onDeleteLead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLead(lead.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
