"use client"
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FormZod from "@/components/core/FormZod";
import { useTranslation } from "react-i18next";
import {
  createFundSavingPlanSchema,
  defineCreateFundSavingPlanFormBody,
  getDaysInMonth,
  generateFrequencyOptions
} from "@/core/fund-saving-plan/constants/create-fund-saving-plan.constant";
import { IBodyFormField } from "@/types/formZod.interface";
import { formatCurrency } from "@/libraries/utils";

interface IEditPlanFormProps {
  isOpen: boolean;
  plan: any;
  onUpdatePlan: (id: string, data: any) => void;
  onClose: () => void;
  isLoading: boolean;
}

const EditPlanForm: React.FC<IEditPlanFormProps> = ({
  isOpen,
  onUpdatePlan,
  onClose,
  isLoading,
  plan,
}) => {
  const { t } = useTranslation(['common', 'spendingPlan']);
  const formSubmitRef = useRef<HTMLFormElement>(null);
  const formRef = useRef<any>(null);
  const [year] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<string>(
    plan?.month?.toString() || (new Date().getMonth() + 1).toString()
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    plan?.day?.toString() || new Date().getDate().toString()
  );
  const [selectedFrequency, setSelectedFrequency] = useState(plan?.type || "MONTHLY");

  // Precompute day options based on month and year
  const getDaysForMonth = (month: string, year: number) => {
    const numberOfDays = getDaysInMonth(parseInt(month), year);
    return Array.from({ length: numberOfDays }, (_, i) => i + 1);
  };

  // Initialize form fields once with all possible fields
  const [allFormFields] = useState(() => {
    const days = getDaysForMonth(currentMonth, year);
    return defineCreateFundSavingPlanFormBody(days);
  });

  // Apply visibility based on current frequency without recreating the fields
  const visibleFields = React.useMemo(() => {
    return allFormFields.map(field => {
      if (field.name === 'startDate') {
        return { ...field, hidden: selectedFrequency !== 'DAILY' && selectedFrequency !== 'MONTHLY' };
      } else if (field.name === 'weekDay') {
        return { ...field, hidden: selectedFrequency !== 'WEEKLY' };
      } else if (field.name === 'day') {
        // For day field, update options when month changes but keep visibility rules
        if (field.name === 'day' && currentMonth) {
          const days = getDaysForMonth(currentMonth, year);
          return {
            ...field,
            hidden: selectedFrequency !== 'MONTHLY' && selectedFrequency !== 'ANNUAL',
            dataSelector: days.map(d => ({ value: d.toString(), label: d.toString() }))
          };
        }
        return { ...field, hidden: selectedFrequency !== 'MONTHLY' && selectedFrequency !== 'ANNUAL' };
      } else if (field.name === 'month') {
        return { ...field, hidden: selectedFrequency !== 'ANNUAL' };
      }
      return field;
    });
  }, [allFormFields, selectedFrequency, currentMonth, year]);

  // Handle day selection when month changes
  useEffect(() => {
    if (currentMonth && formRef.current) {
      const numberOfDays = getDaysInMonth(parseInt(currentMonth), year);

      // Adjust selected day if it exceeds the number of days in the month
      if (parseInt(selectedDay) > numberOfDays) {
        setSelectedDay(numberOfDays.toString());
        formRef.current.setValue('day', numberOfDays.toString());
      }
    }
  }, [currentMonth, year, selectedDay]);

  // Watch form fields and update state accordingly
  useEffect(() => {
    if (!formRef.current) return;

    const subscription = formRef.current.watch((value: any, { name }: any) => {
      if (name === 'month' && value.month) {
        setCurrentMonth(value.month);
      }
      if (name === 'day' && value.day) {
        setSelectedDay(value.day);
      }
      if (name === 'type' && value.type) {
        setSelectedFrequency(value.type);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Default form values based on existing plan
  const defaultValues = {
    name: plan?.name || "",
    description: plan?.description || "",
    targetAmount: formatCurrency(plan?.targetAmount || 0),
    trackerTypeId: plan?.trackerType?.id || "",
    month: plan?.month?.toString() || (new Date().getMonth() + 1).toString(),
    day: plan?.day?.toString() || new Date().getDate().toString(),
    type: plan?.type || "MONTHLY",
    weekDay: plan?.weekDay?.toString() || "1", // Monday as default
    startDate: plan?.startDate ? new Date(plan.startDate) : new Date(),
  };

  const handleUpdatePlan = (data: any) => {
    const planData: any = {
      name: data.name,
      description: data.description,
      targetAmount: parseFloat(data.targetAmount.replace(/[^\d.-]/g, '')),
      trackerTypeId: data.trackerTypeId,
      type: data.type,
    };

    // Add appropriate date fields based on frequency type
    if (data.type === 'DAILY') {
      planData.startDate = data.startDate;
    } else if (data.type === 'WEEKLY') {
      planData.weekDay = parseInt(data.weekDay);
    } else if (data.type === 'MONTHLY') {
      planData.day = parseInt(data.day);
      planData.startDate = data.startDate;
    } else if (data.type === 'ANNUAL') {
      planData.month = parseInt(data.month);
      planData.day = parseInt(data.day);
    }

    onUpdatePlan(plan.id, planData);
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <FormZod
        formSchema={createFundSavingPlanSchema}
        formFieldBody={visibleFields}
        onSubmit={handleUpdatePlan}
        submitRef={formSubmitRef}
        formRef={formRef}
        defaultValues={defaultValues}
        classNameForm="grid grid-cols-2 gap-x-4 gap-y-0"
      />
      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          {t('common:button.cancel')}
        </Button>
        <Button
          onClick={() => formSubmitRef.current?.requestSubmit()}
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
        >
          {t('spendingPlan:form.updatePlan')}
        </Button>
      </div>
    </div>
  );
};

export default EditPlanForm;
