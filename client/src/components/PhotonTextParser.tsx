import React from "react";
import { Link } from "react-router-dom";

type PhotonParserRendererProps = { text: string; nextLine?: boolean };

export const PhotonParserRenderer: React.FC<PhotonParserRendererProps> =
	React.memo(({ text, nextLine = true }) => {
		const parseTags = React.useCallback((word: string) => {
			if (word.startsWith("@")) {
				const profile = word.slice(1);
				return (
					<Link to={`/${profile}`} key={word}>
						<span className="font-bold text-blue-500">{word}</span>
					</Link>
				);
			} else if (word.startsWith("#")) {
				const tag = word.slice(1);
				return (
					<Link to={`/explore/tags/${tag}`} key={word}>
						<span className="font-bold text-blue-500">{word}</span>
					</Link>
				);
			}
			return <span key={word}>{word}</span>;
		}, []);

		const lines = React.useMemo(() => text.split(/\r?\n/), [text]);

		return (
			<>
				{lines.map((line, lineIdx) => (
					<div key={lineIdx} className={!nextLine ? "inline-block" : ""}>
						{line.split(" ").map((word, wordIdx) => (
							<span key={wordIdx}>{parseTags(word)} </span>
						))}
					</div>
				))}
			</>
		);
	});
