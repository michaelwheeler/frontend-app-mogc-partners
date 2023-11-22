import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from '@edx/paragon';
import { NavLink } from 'react-router-dom';

export default function ManagementToolbar({ partner, selectedTab }) {
  return (
    <div className="row">
      <div className="col col-9">
        <ButtonToolbar>
          <ButtonGroup>
            <Button style={{ background: selectedTab === 'cohorts' ? 'red' : 'white' }}>
              <NavLink to={`/${partner}/admin`} style={{ color: selectedTab === 'cohorts' ? 'white' : 'red' }}>
                Cohorts
              </NavLink>
            </Button>
            <Button style={{ background: selectedTab === 'insights' ? 'red' : 'white' }}>
              <NavLink to={`/${partner}/admin/insights`} style={{ color: selectedTab === 'insights' ? 'white' : 'red' }}>Insights</NavLink>
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <div className="col col-3">
        <Button>
          <NavLink to={`/${partner}`}>Preview As Learner</NavLink>
        </Button>
      </div>
    </div>
  );
}

ManagementToolbar.defaultProps = {
  selectedTab: null,
};

ManagementToolbar.propTypes = {
  partner: PropTypes.string.isRequired,
  selectedTab: PropTypes.string,
};
