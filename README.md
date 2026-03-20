# MyApplication

A collection of Python examples demonstrating how to build AI agents using the Anthropic Claude API and Claude Agent SDK.

## Files

- **`agent_api.py`** — Claude API agent examples using the `anthropic` SDK directly:
  - Math agent with tool runner (add/multiply tools)
  - Weather agent with a manual agentic loop
  - Streaming agent with adaptive thinking

- **`agent_sdk.py`** — Claude Agent SDK examples using `claude-agent-sdk`:
  - Basic code analysis agent with built-in tools (Read, Glob, Grep)
  - Subagent example with a specialized code-reviewer agent
  - Agent with PostToolUse hooks for monitoring
  - Session ID capture for later resumption
  - `ClaudeSDKClient` for full lifecycle control

## Setup

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY="your-api-key"
```

## Usage

### Claude API Agent (direct SDK)
```bash
python agent_api.py
```

### Claude Agent SDK
```bash
python agent_sdk.py
```

## Which to use?

| Scenario | Use |
|----------|-----|
| Custom tools with your own logic | `agent_api.py` (Claude API + tool runner) |
| File/web/terminal access needed | `agent_sdk.py` (Agent SDK) |
| Maximum control over the loop | `agent_api.py` (manual agentic loop) |
| Built-in permissions & safety | `agent_sdk.py` (Agent SDK) |
