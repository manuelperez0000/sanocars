import Footer from './Footer';
import Nav from './nav'
const PageLayout = ({ children }) => {
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 bg-dark">
                        <div className="container">
                            <Nav />
                        </div>
                    </div>
                </div>
            </div>

            <main>
                {children}
            </main>

            <Footer />
        </>
    )
}

export default PageLayout
