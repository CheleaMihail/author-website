const config = {
    backend: {
        name: 'github',
        repo: 'your-username/your-repo',
        branch: 'main',
    },
    media_folder: 'static/media',
    public_folder: '/media',
    collections: [
        {
            name: 'poetry',
            label: 'Poetry',
            folder: 'content/poetry',
            create: true,
            slug: '{{slug}}',
            fields: [
                {
                    name: 'title',
                    label: 'Title',
                    widget: 'string',
                },
                {
                    name: 'content',
                    label: 'Content',
                    widget: 'markdown',
                },
            ],
        },
        {
            name: 'prose', // This will be for prose content
            label: 'Prose',
            folder: 'content/prose', // The folder to store prose files
            create: true,
            slug: '{{slug}}',
            fields: [
                {
                    name: 'title',
                    label: 'Title',
                    widget: 'string',
                },
                {
                    name: 'content',
                    label: 'Content',
                    widget: 'markdown',
                },
            ],
        },
    ],
};

export default config;