import React from "react";

const ACTIONS = [
  { key: "buy",      label: "🏡 Buy Property" },
  { key: "sell",     label: "💰 Sell Property" },
  { key: "rent",     label: "🔑 Rent Property" },
];

const QuickActions = ({ onAction, disabled }) => (
  <div className="quick-actions" role="toolbar" aria-label="Quick actions">
    {ACTIONS.map((action) => (
      <button
        key={action.key}
        className="quick-btn"
        onClick={() => onAction(action.key)}
        disabled={disabled}
        aria-label={action.label}
      >
        {action.label}
      </button>
    ))}
  </div>
);

export default QuickActions;