interface sessionLog {
  session: {
    session_info: {
      key: number;
      session_length: number;
      session_completed: boolean;
      start_time_in_day: number;
      date: number;
      interruptions: {
        interruptions: boolean;
        number_of_interruptions: number;
      };
    };
    session_number: number;
    number_of_session_on_date: number;
    tags: string;
    notes: string;
  };
}
