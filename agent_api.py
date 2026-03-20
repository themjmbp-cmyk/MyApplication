"""
Claude API Agent with Tool Use
Demonstrates building an agentic loop using the Anthropic Claude API directly,
with custom tools and automatic loop handling via the beta tool runner.
"""

import anthropic
from anthropic import beta_tool


client = anthropic.Anthropic()


@beta_tool
def add(a: int, b: int) -> int:
    """Add two integers together.

    Args:
        a: First integer.
        b: Second integer.
    """
    return a + b


@beta_tool
def multiply(a: int, b: int) -> int:
    """Multiply two integers together.

    Args:
        a: First integer.
        b: Second integer.
    """
    return a * b


@beta_tool
def get_weather(city: str) -> str:
    """Get the current weather for a city.

    Args:
        city: The name of the city to get weather for.
    """
    # Simulated weather data
    weather_data = {
        "London": "15°C, cloudy with light rain",
        "Paris": "18°C, partly cloudy",
        "Tokyo": "22°C, sunny",
        "New York": "12°C, overcast",
        "Sydney": "25°C, sunny and warm",
    }
    return weather_data.get(city, f"Weather data not available for {city}")


def run_math_agent() -> None:
    """Run a math agent that uses add and multiply tools."""
    print("\n=== Math Agent (Tool Runner) ===")

    runner = client.beta.messages.tool_runner(
        model="claude-opus-4-6",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        tools=[add, multiply],
        messages=[
            {
                "role": "user",
                "content": "What is (15 + 27) * 4? Show your work using the tools.",
            }
        ],
    )

    for message in runner:
        for block in message.content:
            if block.type == "text":
                print(f"Claude: {block.text}")
            elif block.type == "thinking":
                print(f"[Thinking: {block.thinking[:100]}...]")


def run_weather_agent() -> None:
    """Run a weather agent using a manual agentic loop."""
    print("\n=== Weather Agent (Manual Loop) ===")

    tools: list[anthropic.Tool] = [
        {
            "name": "get_weather",
            "description": "Get the current weather for a city",
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The name of the city",
                    }
                },
                "required": ["city"],
            },
        }
    ]

    messages: list[anthropic.MessageParam] = [
        {
            "role": "user",
            "content": "What's the weather like in London and Tokyo? Compare them.",
        }
    ]

    while True:
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=16000,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            for block in response.content:
                if block.type == "text":
                    print(f"Claude: {block.text}")
            break

        # Process tool calls
        tool_results: list[anthropic.ToolResultBlockParam] = []
        for block in response.content:
            if block.type == "tool_use":
                city = block.input.get("city", "")
                result = get_weather.fn(city=city)  # type: ignore[attr-defined]
                print(f"[Tool call: get_weather({city!r}) → {result}]")
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": str(result),
                    }
                )

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})


def run_streaming_agent() -> None:
    """Run an agent with streaming output."""
    print("\n=== Streaming Agent ===")

    with client.messages.stream(
        model="claude-opus-4-6",
        max_tokens=16000,
        thinking={"type": "adaptive"},
        messages=[
            {
                "role": "user",
                "content": "Explain the concept of recursion with a simple Python example.",
            }
        ],
    ) as stream:
        print("Claude: ", end="", flush=True)
        for text in stream.text_stream:
            print(text, end="", flush=True)
        print()

        final = stream.get_final_message()
        print(
            f"\n[Tokens: {final.usage.input_tokens} in, {final.usage.output_tokens} out]"
        )


if __name__ == "__main__":
    run_math_agent()
    run_weather_agent()
    run_streaming_agent()
