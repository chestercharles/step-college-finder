import { Container, Li, Main, Ul } from "~/components";

export default function Complete() {
  return (
    <Container>
      <Main>
        <h4>Assessment Complete</h4>
        <p>
          This tool only includes schools from STEP's college lists that meet
          100% of your financial need
        </p>
        <h4>In-state Colleges</h4>
        <p>
          These in-state universities offer the best financial aid. You should
          apply to the university in your city and any of the others that you
          are interested in.
        </p>
        <Ul>
          <Li>Arizona State University</Li>
          <Li>Northern Arizona University</Li>
          <Li>University of Arizona</Li>
        </Ul>
        <br />
        <h4>Advice for in-state focus</h4>
        <Ul>
          <Li>Complete your application in August.</Li>
          <Li>
            Complete FAFSA in October so you will receive the maximum amount of
            financial aid.
          </Li>
          <Li>Be sure to say you want to live on campus.</Li>
          <Li>
            Review STEP's lists of Arizona and National Scholarships and apply
            to as many as you can.
          </Li>
        </Ul>
        <br />
        <a href="/assessments">Back to my assessments</a>
      </Main>
    </Container>
  );
}
