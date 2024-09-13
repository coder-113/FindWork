import React from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";

export const PortfolioSingle = () => {
  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">
                  Portfolio Single (Extra Pages)
                </h1>
                <div className="custom-breadcrumbs">
                  <a href="index.html">Home</a>{" "}
                  <span className="mx-2 slash">/</span>
                  <a href="portfolio.html">Portfolio</a>{" "}
                  <span className="mx-2 slash">/</span>
                  <span className="text-white">
                    <strong>Portfolio Single</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="site-section pb-0 portfolio-single"
          id="next-section"
        >
          <div className="container">
            <div className="row mb-5 mt-5">
              <div className="col-lg-8">
                <figure>
                  <a
                    href="../../../../assets/images/sq_img_6.jpg"
                    data-fancybox="gallery"
                  >
                    <img
                      src="../../../../assets/images/sq_img_6.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <figure>
                  <a
                    href="../../../../assets/images/sq_img_2.jpg"
                    data-fancybox="gallery"
                  >
                    <img
                      src="../../../../assets/images/sq_img_2.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <figure>
                  <a
                    href="../../../../assets/images/sq_img_7.jpg"
                    data-fancybox="gallery"
                  >
                    <img
                      src="../../../../assets/images/sq_img_7.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
                <figure className="mb-0">
                  <a
                    href="../../../../assets/images/sq_img_8.jpg"
                    data-fancybox="gallery"
                  >
                    <img
                      src="../../../../assets/images/sq_img_8.jpg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                </figure>
              </div>
              <div className="col-lg-4 ml-auto h-100 jm-sticky-top">
                <div className="mb-4">
                  <h3 className="mb-4 h4 border-bottom">Project Description</h3>
                  <p className="mb-0">
                    Nostrum iure atque enim quisquam minima distinctio omnis
                    consequatur aliquam suscipit quidem esse aspernatur Libero
                    excepturi animi repellendus porro impedit
                  </p>
                </div>
                <div className="row mb-4">
                  <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Client</strong>
                    Google, Inc.
                  </div>
                  <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Role</strong>
                    Design, Front-End and Back-End (WordPress)
                  </div>
                  <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black">Year Started</strong>
                    2019
                  </div>
                  <div className="col-sm-12 col-md-12 mb-4 col-lg-12">
                    <strong className="d-block text-black mb-3">
                      Website URL
                    </strong>
                    <a
                      href="#"
                      className="btn btn-outline-primary border-width-2"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
                <div className="block__87154 mb-0">
                  <blockquote>
                    <p>
                      Ipsum harum assumenda in eum vel eveniet numquam, cumque
                      vero vitae enim cupiditate deserunt eligendi officia modi
                      consectetur. Expedita tempora quos nobis earum hic ex
                      asperiores quisquam optio nostrum sit
                    </p>
                  </blockquote>
                  <div className="block__91147 d-flex align-items-center">
                    <figure className="mr-4">
                      <img
                        src="../../../../assets/images/person_2.jpg"
                        alt="Image"
                        className="img-fluid"
                      />
                    </figure>
                    <div>
                      <h3>Chris Peter</h3>
                      <span className="position">Web Designer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className=" py-3 site-section mb-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 text-center">
                <a
                  href="#"
                  className="btn btn-md btn-outline-primary border-width-2 d-block"
                >
                  Previous Project
                </a>
              </div>
              <div className="col-md-4 text-center">
                <a
                  href="#"
                  className="btn btn-md btn-primary border-width-2 d-block"
                >
                  All Projects
                </a>
              </div>
              <div className="col-md-4 text-center">
                <a
                  href="#"
                  className="btn btn-md btn-outline-primary border-width-2 d-block"
                >
                  Next Project
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-12 text-center" data-aos="fade">
                <h2 className="section-title mb-3">Happy Candidates Says</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="block__87154 bg-white rounded">
                  <blockquote>
                    <p>
                      Ipsum harum assumenda in eum vel eveniet numquam cumque
                      vero vitae enim cupiditate deserunt eligendi officia modi
                      consectetur. Expedita tempora quos nobis earum hic ex
                      asperiores quisquam optio nostrum sit
                    </p>
                  </blockquote>
                  <div className="block__91147 d-flex align-items-center">
                    <figure className="mr-4">
                      <img
                        src="../../../../assets/images/person_1.jpg"
                        alt="Image"
                        className="img-fluid"
                      />
                    </figure>
                    <div>
                      <h3>Elisabeth Smith</h3>
                      <span className="position">Creative Director</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="block__87154 bg-white rounded">
                  <blockquote>
                    <p>
                      Ipsum harum assumenda in eum vel eveniet numquam, cumque
                      vero vitae enim cupiditate deserunt eligendi officia modi
                      consectetur. Expedita tempora quos nobis earum hic ex
                      asperiores quisquam optio nostrum sit
                    </p>
                  </blockquote>
                  <div className="block__91147 d-flex align-items-center">
                    <figure className="mr-4">
                      <img
                        src="../../../../assets/images/person_2.jpg"
                        alt="Image"
                        className="img-fluid"
                      />
                    </figure>
                    <div>
                      <h3>Chris Peter</h3>
                      <span className="position">Web Designer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};
export default PortfolioSingle;
