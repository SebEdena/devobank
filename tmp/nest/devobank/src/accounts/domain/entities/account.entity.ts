export enum AccountStatus {
  OPEN = 'open',
  BLOCKED = 'blocked',
  CLOSED = 'closed',
}

type AccountProps = {
  id: string;
  ownerId: string;
  name: string;
  status: AccountStatus;

  openedAt: Date;
  closedAt: Date | null;
};

import { Entity } from 'src/shared/entity';

export class Account extends Entity<AccountProps> {
  protected cloneWith(props: Partial<AccountProps>): this {
    return new Account({
      ...this.props,
      ...props,
    }) as this;
  }
}
