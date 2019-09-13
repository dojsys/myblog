const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
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
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `/posts/${node.frontmatter.slug}`,
      component: node.parent.absolutePath,
      context: {
        absPath: node.parent.absolutePath,
        timeToRead: node.timeToRead,
        cover: node.frontmatter.cover,
        tableOfContents: node.tableOfContents,
      },
    });
  });
  
//   const posts = result.data.allMarkdownRemark.edges
//   posts.forEach((post, index) => {
//     const previous = index === posts.length - 1 ? null : posts[index + 1].node
//     const next = index === 0 ? null : posts[index - 1].node
//     createPage({
//       path: post.node.fields.slug,
//       component: blogPost,
//       context: {
//         slug: post.node.fields.slug,
//         previous,
//         next,
//       },
//     })
//   })
}

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
