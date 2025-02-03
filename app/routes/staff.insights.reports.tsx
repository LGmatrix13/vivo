import Insight from "~/components/common/Insight";

export default function StaffInsightsReports() {
  return (
    <div className="flex flex-col space-y-5">
      <Insight level="SUCCESS" title="All staff have submitted their report" />

      <Insight
        level="DANGER"
        title="All staff have submitted their report"
        explanation="Something..."
      />
      <Insight level="WARNING" title="All staff have submitted their report" />
    </div>
  );
}
