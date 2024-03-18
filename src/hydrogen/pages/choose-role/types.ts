export type Role = {
  roleCode: string;
  roleId: number;
  roleName: string;
};

export type Tenant = {
  agentEmployeeId: number;
  roleType: number;
  userId: number;
  status: number;
  tenantId: string;
  tenantName: string;
  roleList: Role[];
  agentBizType: number;
  departmentId: number;
};
