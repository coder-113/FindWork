import React, { useEffect } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { JobBoardStats } from "../../components/job-board-stats/JobBoardStats";

export const AboutUs = () => {
  console.log("about page!");
  useEffect(() => {}, []);
  return (
    <GlobalLayoutUser>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: 'url("../../../assets/images/hero_1.jpg")' }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">About Us</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">About Us</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <JobBoardStats />
      <section className="site-section pb-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <a
                data-fancybox=""
                data-ratio={2}
                href="https://vimeo.com/317571768"
                className="block__96788"
              >
                <span className="play-icon">
                  <span className="icon-play" />
                </span>
                <img
                  src="../../../assets/images/sq_img_6.jpg"
                  alt="Image"
                  className="img-fluid img-shadow"
                />
              </a>
            </div>
            <div className="col-lg-5 ml-auto">
              <h2 className="section-title mb-3">
                JobBoard For Freelancers, Web Developers
              </h2>
              <p className="lead">
                Eveniet voluptatibus voluptates suscipit minima, cum voluptatum
                ut dolor, sed facere corporis qui, ea quisquam quis odit minus
                nulla vitae. Sit, voluptatem.
              </p>
              <p>
                Ipsum harum assumenda in eum vel eveniet numquam, cumque vero
                vitae enim cupiditate deserunt eligendi officia modi
                consectetur. Expedita tempora quos nobis earum hic ex asperiores
                quisquam optio nostrum sit!
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section pt-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0 order-md-2">
              <a
                data-fancybox=""
                data-ratio={2}
                href="https://vimeo.com/317571768"
                className="block__96788"
              >
                <span className="play-icon">
                  <span className="icon-play" />
                </span>
                <img
                  src="../../../assets/images/sq_img_8.jpg"
                  alt="Image"
                  className="img-fluid img-shadow"
                />
              </a>
            </div>
            <div className="col-lg-5 mr-auto order-md-1  mb-5 mb-lg-0">
              <h2 className="section-title mb-3">JobBoard For Workers</h2>
              <p className="lead">
                Eveniet voluptatibus voluptates suscipit minima, cum voluptatum
                ut dolor, sed facere corporis qui, ea quisquam quis odit minus
                nulla vitae. Sit, voluptatem.
              </p>
              <p>
                Ipsum harum assumenda in eum vel eveniet numquam, cumque vero
                vitae enim cupiditate deserunt eligendi officia modi
                consectetur. Expedita tempora quos nobis earum hic ex asperiores
                quisquam optio nostrum sit!
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center" data-aos="fade">
              <h2 className="section-title mb-3">Our Team</h2>
            </div>
          </div>
          <div className="row align-items-center block__69944">
            <div className="col-md-6">
              <img
                src="../../../assets/images/person_6.jpg"
                alt="Image"
                className="img-fluid mb-4 rounded"
              />
            </div>
            <div className="col-md-6">
              <h3>Elisabeth Smith</h3>
              <p className="text-muted">Creative Director</p>
              <p>
                Soluta quasi cum delectus eum facilis recusandae nesciunt
                molestias accusantium libero dolores repellat id in dolorem
                laborum ad modi qui at quas dolorum voluptatem voluptatum
                repudiandae voluptatibus ut? Ex vel ad explicabo iure ipsa
                possimus consectetur neque rem molestiae eligendi velit?.
              </p>
              <div className="social mt-4">
                <a href="#">
                  <span className="icon-facebook" />
                </a>
                <a href="#">
                  <span className="icon-twitter" />
                </a>
                <a href="#">
                  <span className="icon-instagram" />
                </a>
                <a href="#">
                  <span className="icon-linkedin" />
                </a>
              </div>
            </div>
            <div className="col-md-6 order-md-2 ml-md-auto">
              <img
                src="../../../assets/images/person_5.jpg"
                alt="Image"
                className="img-fluid mb-4 rounded"
              />
            </div>
            <div className="col-md-6">
              <h3>Chintan Patel</h3>
              <p className="text-muted">Creative Director</p>
              <p>
                Soluta quasi cum delectus eum facilis recusandae nesciunt
                molestias accusantium libero dolores repellat id in dolorem
                laborum ad modi qui at quas dolorum voluptatem voluptatum
                repudiandae voluptatibus ut? Ex vel ad explicabo iure ipsa
                possimus consectetur neque rem molestiae eligendi velit?.
              </p>
              <div className="social mt-4">
                <a href="#">
                  <span className="icon-facebook" />
                </a>
                <a href="#">
                  <span className="icon-twitter" />
                </a>
                <a href="#">
                  <span className="icon-instagram" />
                </a>
                <a href="#">
                  <span className="icon-linkedin" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
};
export default AboutUs;
