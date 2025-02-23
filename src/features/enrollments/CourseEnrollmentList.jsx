import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, DropdownFilter, TextFilter } from '@openedx/paragon';
import useRecords from './useRecords';
import { selectAllMembers } from '../members/membersSlice';
import useMembers from '../members/useMembers';

import { getCohortFilterOptions } from '../../utils/forms';

function courseEnrollments(courseKey) {
  return (enrollment) => enrollment.offering.courseKey === courseKey;
}

function courseCompletions(courseKey) {
  return (enrollment) => (
    enrollment.isComplete && enrollment.offering.courseKey === courseKey
  );
}

export default function CourseEnrollmentList({ partnerSlug, offerings, cohorts }) {
  const [enrollments, enrollmentsStatus] = useRecords();
  const [members] = useMembers(selectAllMembers);
  const partnerMembers = members.filter(
    member => member.partner === partnerSlug,
  );

  const offeringsMap = offerings.reduce((offeringsCourseMap, offering) => {
    const offeringCourseKey = offering.details.courseKey;
    if (Object.keys(offeringsCourseMap).includes(offeringCourseKey)) {
      offeringsCourseMap[offeringCourseKey].cohorts.push(offering.cohort);
    } else {
      offeringsCourseMap[offeringCourseKey] = {
        title: offering.details.title,
        courseKey: offeringCourseKey,
        cohorts: [offering.cohort],
        enrollments: enrollments.filter(courseEnrollments(offeringCourseKey))
          .length,
        completions: enrollments.filter(courseCompletions(offeringCourseKey))
          .length,
      };
    }
    return offeringsCourseMap;
  }, {});

  const data = Object.keys(offeringsMap).map((offeringCourseKey) => {
    const offeringData = offeringsMap[offeringCourseKey];
    return {
      ...offeringData,
      learners: new Set(
        partnerMembers.reduce((courseLearners, member) => {
          if (offeringData.cohorts.includes(member.cohort)) {
            courseLearners.push(member.email);
          }
          return courseLearners;
        }, []),
      ).size,
    };
  });

  const cohortFilterOptions = getCohortFilterOptions(cohorts);

  return (
    <DataTable
      isFilterable
      isLoading={enrollmentsStatus !== 'success'}
      enableHiding
      initialState={{ hiddenColumns: ['cohorts'] }}
      data={data}
      defaultColumnValues={{ Filter: TextFilter }}
      itemCount={data.length}
      columns={[
        {
          Header: 'Filter by cohort',
          accessor: 'cohorts',
          Filter: DropdownFilter,
          filter: 'includes',
          filterChoices: cohortFilterOptions,
        },
        { Header: 'Title', accessor: 'title', disableFilters: true },
        { Header: 'Learners', accessor: 'learners', disableFilters: true },
        {
          Header: 'Enrollments',
          accessor: 'enrollments',
          disableFilters: true,
        },
        {
          Header: 'Completions',
          accessor: 'completions',
          disableFilters: true,
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content="No courses found." />
      <DataTable.TableFooter />
    </DataTable>
  );
}

CourseEnrollmentList.propTypes = {
  partnerSlug: PropTypes.string.isRequired,
  offerings: PropTypes.arrayOf(
    PropTypes.shape({
      cohort: PropTypes.string,
      continueLearningUrl: PropTypes.string,
      details: PropTypes.shape({
        courseKey: PropTypes.string,
        description: PropTypes.string,
        shortDescription: PropTypes.string,
        title: PropTypes.string,
      }),
      id: PropTypes.number,
      isEnrolled: PropTypes.bool,
      offering: PropTypes.number,
      partner: PropTypes.string,
    }),
  ).isRequired,
  cohorts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      partner: PropTypes.string,
      uuid: PropTypes.string,
    }),
  ).isRequired,
};
