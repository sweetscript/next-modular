import { Footer, Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { DocsHeader } from '../../components/docs-header'
import { SiteFooter } from '../../components/footer'

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DocsHeader />
      <Layout
        navbar={<></>}
        pageMap={await getPageMap('/docs')}
        docsRepositoryBase="https://github.com/sweetscript/next-modular/tree/main/docs"
        footer={<></>}
        navigation={{
          prev: true,
          next: true
        }}
      >
        {children}
      </Layout>
      <SiteFooter />
    </>
  )
}
