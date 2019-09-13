const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const blogPost = path.resolve(`./src/templates/blog-post.js`);

    return new Promise((resolve, reject) => {
        resolve(
            graphql(
                `
                    {
                        allMdx {
                            edges {
                                node {
                                    id
                                    tableOfContents
                                    timeToRead
                                    frontmatter {
                                        slug
                                        title
                                        description
                                        date
                                        type
                                        featured
                                        cover {
                                            childImageSharp {
                                                fluid(
                                                maxWidth: 1500
                                                maxHeight: 700
                                                quality: 100
                                                cropFocus: ENTROPY
                                                ) {
                                                    base64
                                                    tracedSVG
                                                    aspectRatio
                                                    src
                                                    srcSet
                                                    srcWebp
                                                    srcSetWebp
                                                    sizes
                                                    originalImg
                                                    originalName
                                                    presentationWidth
                                                    presentationHeight
                                                }
                                            }
                                        }
                                    }
                                    parent {
                                        ... on File {
                                            sourceInstanceName
                                            absolutePath
                                            relativePath
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            ).then(result => {
                if (result.errors) {
                    reject(result.errors);
                }

                // Create blog posts pages.
                const posts = result.data.allMarkdownRemark.edges;

                result.data.allMdx.edges.forEach(({ node, index }) => {
                    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
                    const next = index === 0 ? null : posts[index - 1].node;
                    createPage({
                        path: `/posts/${node.frontmatter.slug}`,
                        component: node.parent.absolutePath,
                        context: {
                            absPath: node.parent.absolutePath,
                            timeToRead: node.timeToRead,
                            cover: node.frontmatter.cover,
                            tableOfContents: node.tableOfContents,
                            previous,
                            next,
                        },
                    });
                });

            })
        );
    });
}
