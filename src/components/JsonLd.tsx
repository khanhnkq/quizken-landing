export function JsonLd({ data }: { data: unknown | unknown[] }) {
    const nodes = Array.isArray(data) ? data : [data];

    return (
        <>
            {nodes.map((node, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(node).replace(/</g, "\\u003c"),
                    }}
                />
            ))}
        </>
    );
}