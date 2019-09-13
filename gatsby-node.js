const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
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
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
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
        const posts = result.data.allMdx.edges
        posts.forEach(({ post, index }) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node
          createPage({
            path: `/posts/${post.node.frontmatter.slug}`,
            component: post.node.parent.absolutePath,
            //path: node.fields.slug,
            //component: blogPost,
            context: {
              absPath: post.node.parent.absolutePath,
              timeToRead: post.node.timeToRead,
              cover: post.node.frontmatter.cover,
              tableOfContents: post.node.tableOfContents,
              previous,
              next,
            },
          });
        });
        
      })
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
