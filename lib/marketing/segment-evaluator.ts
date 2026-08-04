import { prisma } from "@/lib/prisma";

export type SegmentCondition = {
  field: string;
  operator: "equals" | "contains" | "gt" | "lt" | "in" | "isSet";
  value?: any;
};

export type SegmentRule = {
  logicalOperator: "AND" | "OR";
  conditions: (SegmentCondition | SegmentRule)[];
};

export async function evaluateSegment(segmentId: string) {
  const segment = await prisma.marketingSegment.findUnique({
    where: { id: segmentId },
  });

  if (!segment) {
    throw new Error("Segment not found");
  }

  const rules = segment.rules as unknown as SegmentRule;

  const prismaWhere = buildPrismaWhere(rules);

  const contacts = await prisma.marketingContact.findMany({
    where: prismaWhere,
    include: {
      customer: true,
      tags: { include: { tag: true } },
      lists: { include: { list: true } },
    }
  });

  return contacts;
}

function buildPrismaWhere(rule: SegmentRule): any {
  if (!rule || !rule.logicalOperator || !rule.conditions) {
    return {};
  }

  const prismaConditions = rule.conditions.map((conditionOrRule) => {
    if ("logicalOperator" in conditionOrRule) {
      return buildPrismaWhere(conditionOrRule as SegmentRule);
    }

    const condition = conditionOrRule as SegmentCondition;
    return mapConditionToPrisma(condition);
  });

  if (rule.logicalOperator === "AND") {
    return { AND: prismaConditions };
  } else if (rule.logicalOperator === "OR") {
    return { OR: prismaConditions };
  }

  return {};
}

function mapConditionToPrisma(condition: SegmentCondition): any {
  const { field, operator, value } = condition;
  
  const isCustomerField = ["totalSpent", "totalBookings"].includes(field);

  let filter = {};

  switch (operator) {
    case "equals":
      filter = { equals: value };
      break;
    case "contains":
      filter = { contains: value, mode: "insensitive" };
      break;
    case "gt":
      filter = { gt: value };
      break;
    case "lt":
      filter = { lt: value };
      break;
    case "in":
      filter = { in: Array.isArray(value) ? value : [value] };
      break;
    case "isSet":
      filter = { not: null };
      break;
    default:
      filter = { equals: value };
  }

  if (isCustomerField) {
    return {
      customer: {
        [field]: filter
      }
    };
  }
  
  if (field === "listId") {
    return {
      lists: {
        some: { listId: filter }
      }
    };
  }

  if (field === "tagId") {
    return {
      tags: {
        some: { tagId: filter }
      }
    };
  }

  return {
    [field]: filter
  };
}
