import React from "react";
import CountUp from "react-countup";
export const JobBoardStats = () => {
  return (
    <section
      className="py-5 bg-image overlay-primary fixed overlay"
      id="next"
      style={{
        backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
      }}
    >
      <div className="container">
        <div className="row mb-5 justify-content-center">
          <div className="col-md-7 text-center">
            <h2 className="section-title mb-2 text-white">
              JobBoard Site Stats
            </h2>
            <p className="lead text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              unde officiis recusandae sequi excepturi corrupti.
            </p>
          </div>
        </div>
        <div className="row pb-0 block__19738 section-counter">
          <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <strong className="number">
                <CountUp start={0} end={120} duration={5}></CountUp>
              </strong>
            </div>
            <span className="caption">Candidates</span>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <strong className="number">
                <CountUp start={0} end={120} duration={5}></CountUp>
              </strong>
            </div>
            <span className="caption">Jobs Posted</span>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <strong className="number">
                <CountUp start={0} end={120} duration={5}></CountUp>
              </strong>
            </div>
            <span className="caption">Jobs Filled</span>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-5 mb-lg-0">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <strong className="number">
                <CountUp start={0} end={120} duration={5}></CountUp>
              </strong>
            </div>
            <span className="caption">Companies</span>
          </div>
        </div>
      </div>
    </section>
  );
};
