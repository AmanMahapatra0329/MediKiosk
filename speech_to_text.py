import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

from faster_whisper import WhisperModel


@dataclass(frozen=True)
class TranscriptionResult:
    text: str
    language: str
    language_probability: float


class MultilingualSpeechToText:
    def __init__(
        self,
        model_size: str = "small",
        device: str = "auto",
        compute_type: str = "default",
    ) -> None:
        self.model = WhisperModel(
            model_size,
            device=device,
            compute_type=compute_type,
        )

    def transcribe(
        self,
        audio_path: str | Path,
        language: str | None = None,
    ) -> TranscriptionResult:
        path = Path(audio_path)
        if not path.is_file():
            raise FileNotFoundError(f"Audio file not found: {path}")

        segments, info = self.model.transcribe(
            str(path),
            language=language,
            task="transcribe",
        )
        text = " ".join(segment.text.strip() for segment in segments).strip()

        return TranscriptionResult(
            text=text,
            language=info.language,
            language_probability=info.language_probability,
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Transcribe speech from an audio file in a supported language."
    )
    parser.add_argument(
        "audio_file",
        type=Path,
        nargs="?",
        default=Path("Recording.m4a"),
        help="Path to the audio file (default: Recording.m4a)",
    )
    parser.add_argument(
        "--language",
        help="Spoken language code (for example, en or es); detect automatically if omitted",
    )
    parser.add_argument(
        "--model",
        default="base",
        help="Whisper model size (default: base)",
    )
    parser.add_argument(
        "--device",
        default="auto",
        help="Inference device, such as auto, cpu, or cuda (default: auto)",
    )
    args = parser.parse_args()

    if not args.audio_file.is_file():
        parser.error(f"audio file not found: {args.audio_file}")

    transcriber = MultilingualSpeechToText(
        model_size=args.model,
        device=args.device,
    )
    result = transcriber.transcribe(args.audio_file, language=args.language)
    print(result.text)
    print(
        f"Detected language: {result.language} "
        f"(confidence: {result.language_probability:.0%})",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()