"""
Claude Agent SDK Examples
Demonstrates building AI agents using the Claude Agent SDK with built-in
tools, subagents, hooks, and MCP server support.
"""

import anyio
from claude_agent_sdk import (
    AgentDefinition,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    HookMatcher,
    ResultMessage,
    SystemMessage,
    query,
)


async def run_basic_agent() -> None:
    """Run a basic agent that reads and analyzes code."""
    print("\n=== Basic Code Analysis Agent ===")

    async for message in query(
        prompt="List all Python files in the current directory and summarize what each one does.",
        options=ClaudeAgentOptions(
            cwd="/home/user/MyApplication",
            allowed_tools=["Read", "Glob", "Grep"],
            max_turns=10,
        ),
    ):
        if isinstance(message, ResultMessage):
            print(f"Result: {message.result}")


async def run_subagent_example() -> None:
    """Demonstrate using subagents for parallel specialized tasks."""
    print("\n=== Subagent Example ===")

    async for message in query(
        prompt="Use the code-reviewer agent to analyze agent_api.py for quality and potential issues.",
        options=ClaudeAgentOptions(
            cwd="/home/user/MyApplication",
            allowed_tools=["Read", "Glob", "Grep", "Agent"],
            max_turns=20,
            agents={
                "code-reviewer": AgentDefinition(
                    description="Expert Python code reviewer focused on quality, security, and best practices.",
                    prompt=(
                        "You are a senior Python engineer reviewing code. Focus on:\n"
                        "1. Code quality and readability\n"
                        "2. Potential bugs or edge cases\n"
                        "3. Security considerations\n"
                        "4. Pythonic patterns and best practices\n"
                        "Provide specific, actionable feedback."
                    ),
                    tools=["Read", "Glob"],
                )
            },
        ),
    ):
        if isinstance(message, ResultMessage):
            print(f"Review Result:\n{message.result}")


async def run_agent_with_hooks() -> None:
    """Demonstrate agent hooks for monitoring tool usage."""
    print("\n=== Agent with Hooks ===")

    tool_calls: list[dict[str, str]] = []

    async def track_tool_use(input_data: dict, tool_use_id: str, context: dict) -> dict:  # type: ignore[type-arg]
        tool_name = input_data.get("tool_name", "unknown")
        tool_input = input_data.get("tool_input", {})
        tool_calls.append({"tool": tool_name, "input": str(tool_input)[:80]})
        print(f"  [Hook] Tool used: {tool_name}")
        return {}

    async for message in query(
        prompt="Search for any TODO comments in the Python files.",
        options=ClaudeAgentOptions(
            cwd="/home/user/MyApplication",
            allowed_tools=["Read", "Glob", "Grep"],
            max_turns=10,
            hooks={
                "PostToolUse": [
                    HookMatcher(matcher="Read|Glob|Grep", hooks=[track_tool_use])
                ]
            },
        ),
    ):
        if isinstance(message, ResultMessage):
            print(f"Result: {message.result}")
            print(f"\nTools used ({len(tool_calls)} total):")
            for call in tool_calls:
                print(f"  - {call['tool']}: {call['input']}")


async def run_session_capture() -> None:
    """Demonstrate capturing session ID for later resumption."""
    print("\n=== Session Capture ===")

    session_id: str | None = None

    async for message in query(
        prompt="What files are in the current directory?",
        options=ClaudeAgentOptions(
            cwd="/home/user/MyApplication",
            allowed_tools=["Glob"],
            max_turns=5,
        ),
    ):
        if isinstance(message, SystemMessage) and message.subtype == "init":
            session_id = message.data.get("session_id")
            print(f"Session ID captured: {session_id}")
        elif isinstance(message, ResultMessage):
            print(f"Result: {message.result}")

    if session_id:
        print(f"\nSession {session_id} can be resumed with: options.resume='{session_id}'")


async def run_client_example() -> None:
    """Demonstrate ClaudeSDKClient for full control over agent lifecycle."""
    print("\n=== ClaudeSDKClient Example ===")

    from claude_agent_sdk import AssistantMessage, TextBlock

    options = ClaudeAgentOptions(
        cwd="/home/user/MyApplication",
        allowed_tools=["Read", "Glob"],
        max_turns=5,
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Describe the purpose of agent_api.py in one sentence.")
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")


async def main() -> None:
    """Run all agent examples."""
    await run_basic_agent()
    await run_agent_with_hooks()
    await run_session_capture()
    await run_client_example()
    await run_subagent_example()


if __name__ == "__main__":
    anyio.run(main)
