import React from 'react';
import { Container, Stack } from '@edx/paragon';

import MemberStatsCard from '../members/MemberStatCard';
import EnrollmentStatsCard from '../enrollments/EnrollmentStatCard';
import CourseEnrollmentList from '../enrollments/CourseEnrollmentList';
import MemberEnrollmentList from '../enrollments/MemberEnrollmentList';
import MembershipProvider from '../members/MembershipProvider';
import usePartner from './usePartner';
import StatCard from './StatCard';
import ManagementMenu from './ManagementMenu';
import PartnerHeading from './PartnerHeading';

export default function PartnerStats() {
  const [partner, partnerSlug] = usePartner();

  const courseCount = partner?.offerings.length || 0;
  const courseUnit = courseCount === 1 ? 'Course' : 'Courses';

  return (
    <>
      <PartnerHeading partnerName={partner?.name}>
        <ManagementMenu partner={partnerSlug} />
      </PartnerHeading>

      <section className="p-3 py-5 bg-gray-100">
        <Container size="lg">
          <h2 className="text-center mb-5">Organizational Totals</h2>
          <Stack direction="horizontal" gap={3}>
            <StatCard value={courseCount} unit="Total" secondary={courseUnit} />
            <MemberStatsCard partner={partnerSlug} />
            <EnrollmentStatsCard partner={partnerSlug} />
            <EnrollmentStatsCard partner={partnerSlug} onlyComplete />
          </Stack>
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>Course Details</h2>
          <CourseEnrollmentList offerings={partner?.offerings ?? []} />
        </Container>
      </section>

      <section className="p-3 py-5">
        <Container size="lg">
          <h2>User Details</h2>
          <MembershipProvider>
            <MemberEnrollmentList offerings={partner?.offerings ?? []} />
          </MembershipProvider>
        </Container>
      </section>
    </>
  );
}
