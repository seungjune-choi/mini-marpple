import { convert, LocalDateTime, nativeJs } from '@js-joda/core';

export class DateTransformer {
  public static toLocalDateTime(date: Date): LocalDateTime {
    return nativeJs(date).toLocalDateTime();
  }

  public static toDate(localDateTime: LocalDateTime): Date {
    return convert(localDateTime).toDate();
  }
}
