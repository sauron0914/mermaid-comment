export type WidgetRef = {
  fetchData?: () => Promise<void>;
};

export interface WidgetProps extends ResourceTree {
  userOrganization?: UserOrganization;
}

type UserOrganization = {
  agentId: number;
  channelType: string;
  cityCode: string;
  cityName: string;
  deptLevel: string;
  departName: string;
  deptDepth: number;
  deptId: string;
  moduleList: any[];
  nickName: string;
  roleName: string;
  roleType: number;
  userId: string;
  organization: string;
};

export interface ResourceTree {
  resCode: string;
  children: ResourceTree[];
  component?: string;
  hidden?: boolean;
  sort: number;
  resName: string;
  iconUrl?: string;
  accessUrl?: string;
  iconBack?: string
}
