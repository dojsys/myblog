import React from "react"
import { Link, graphql } from "gatsby"
import styled from '@emotion/styled';
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        <List>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <li key={node.fields.slug}>
              <Link
                  style={{ textDecoration: `none` }}
                  to={`/posts/${node.frontmatter.slug}`}
                >
                  <h3>{node.frontmatter.title}</h3>
              </Link>
              <DescriptionBlock>
                  {node.frontmatter.description}
              </DescriptionBlock>
              <ItemFooterBlock>
                <p>
                  {new Date(Date.parse(node.frontmatter.date)).toDateString()}
                </p>
                <p>{node.timeToRead} min read</p>
                <Link
                  style={{ textDecoration: `none` }}
                  to={`/posts/${node.frontmatter.slug}`}
                >
                  <Button secondary={true}>Read</Button>
                </Link>
              </ItemFooterBlock>
            </li>
          )
        })}
        </List>
      </Layout>
    )
  }
}

export default BlogIndex

const List = styled('ul')`
  margin-left: 0px;

  li {
    list-style: none;
    margin-bottom: 30px;
  }

  h3 {
    margin-bottom: 10px;
  }
`;

const DescriptionBlock = styled('p')`
  color: #73737d;
  margin-bottom: 8px;
  max-width: 350px;
`;

const ItemFooterBlock = styled('div')`
  display: flex;
  align-items: center;

  p {
    font-size: 14px;
    font-weight: 600;
    margin-right: 8px;
    margin-bottom: 0px;
  }
`;

export const pageQuery = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          timeToRead
          frontmatter {
            slug
            title
            description
            date
            featured
            cover {
              childImageSharp {
                fluid(
                  maxWidth: 800
                  maxHeight: 280
                  quality: 80
                  cropFocus: ENTROPY
                ) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
