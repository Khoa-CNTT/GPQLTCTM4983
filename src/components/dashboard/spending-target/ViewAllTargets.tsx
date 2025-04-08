import React, { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Search, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import NoDataPlaceHolder from "@/images/empty-box.png";
import { formatCurrency } from "@/libraries/utils";
import { IBudgetTarget } from "@/core/fund-saving-target/models/fund-saving-target.interface";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ViewAllTargetsProps {
    isLoading: boolean;
    targets: IBudgetTarget[];
    onSelectTarget: (target: IBudgetTarget) => void;
}

const ViewAllTargets: React.FC<ViewAllTargetsProps> = ({
    isLoading,
    targets,
    onSelectTarget,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    // Get unique tracker types
    const trackerTypes = useMemo(() => {
        const types = targets.map(target => target.trackerTypeName);
        return ["all", ...Array.from(new Set(types))];
    }, [targets]);

    // Get unique months from targets
    const availableMonths = useMemo(() => {
        const months = targets.map(target => {
            const date = new Date(target.startDate);
            return {
                value: format(date, "yyyy-MM"),
                label: format(date, "MMMM yyyy", { locale: vi })
            };
        });
        return [
            { value: "all", label: "Tất cả" },
            ...Array.from(new Set(months.map(m => JSON.stringify(m))))
                .map(m => JSON.parse(m))
                .sort((a, b) => b.value.localeCompare(a.value))
        ];
    }, [targets]);

    // Filter targets based on search, type, month, and status
    const filteredTargets = useMemo(() => {
        return targets.filter(target => {
            const matchesSearch = target.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === "all" || target.trackerTypeName === selectedType;
            const matchesMonth = selectedMonth === "all" || format(new Date(target.startDate), "yyyy-MM") === selectedMonth;
            const matchesStatus = selectedStatus === "all" ||
                (selectedStatus === "success" && target.status === "INACTIVE") ||
                (selectedStatus === "pending" && target.status === "ACTIVE");
            return matchesSearch && matchesType && matchesMonth && matchesStatus;
        });
    }, [targets, searchTerm, selectedType, selectedMonth, selectedStatus]);

    const activeFilters = useMemo(() => {
        const filters = [];
        if (selectedType !== "all") {
            filters.push({
                label: selectedType,
                clear: () => setSelectedType("all")
            });
        }
        if (selectedMonth !== "all") {
            const monthLabel = availableMonths.find(m => m.value === selectedMonth)?.label;
            filters.push({
                label: monthLabel,
                clear: () => setSelectedMonth("all")
            });
        }
        if (selectedStatus !== "all") {
            filters.push({
                label: selectedStatus === "success" ? "Hoàn thành" : "Đang thực hiện",
                clear: () => setSelectedStatus("all")
            });
        }
        return filters;
    }, [selectedType, selectedMonth, selectedStatus, availableMonths]);

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 h-full">
                <CardContent className="pt-6 px-6">
                    {!isLoading ? (
                        <div className="space-y-8">
                            <div className="flex flex-col space-y-4">
                                {/* Filter Section */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Tìm kiếm mục tiêu..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-8"
                                            />
                                        </div>
                                        <Select
                                            value={selectedType}
                                            onValueChange={setSelectedType}
                                        >
                                            <SelectTrigger className="w-full md:w-[200px]">
                                                <SelectValue placeholder="Chọn loại" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {trackerTypes
                                                    .filter((type): type is string => type !== null)
                                                    .map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type === "all" ? "Tất cả" : type}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={selectedMonth}
                                            onValueChange={setSelectedMonth}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn tháng" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableMonths.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={selectedStatus}
                                            onValueChange={setSelectedStatus}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                                <SelectItem value="success">Hoàn thành</SelectItem>
                                                <SelectItem value="pending">Đang thực hiện</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Active Filters */}
                                    {activeFilters.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {activeFilters.map((filter, index) => (
                                                <Button
                                                    key={index}
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={filter.clear}
                                                    className="h-8 gap-1 text-xs"
                                                >
                                                    {filter.label}
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Results count */}
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span>Hiển thị {filteredTargets.length} mục tiêu</span>
                                    {(selectedType !== "all" || selectedMonth !== "all" || selectedStatus !== "all") && (
                                        <button
                                            onClick={() => {
                                                setSelectedType("all");
                                                setSelectedMonth("all");
                                                setSelectedStatus("all");
                                                setSearchTerm("");
                                            }}
                                            className="h-auto py-1 px-2 text-xs bg-transparent border-none cursor-pointer"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    )}
                                </div>

                                {/* Targets Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTargets.map((target) => {
                                        const percentage = Math.round((target.currentAmount / target.targetAmount) * 100);
                                        const isNearlyComplete = percentage >= 90;

                                        return (
                                            <div
                                                key={target.id}
                                                onClick={() => onSelectTarget(target)}
                                                className="group relative p-5 rounded-xl border bg-card hover:shadow-lg hover:scale-[1.02] hover:border-emerald-200 
                                                         dark:hover:border-emerald-800 cursor-pointer transition-all duration-200 ease-in-out"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 
                                                              group-hover:opacity-100 transition-opacity duration-200" />

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="font-medium text-lg truncate mr-3">{target.name}</div>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs font-medium px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 
                                                                 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                                    >
                                                        {target.trackerTypeName}
                                                    </Badge>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-muted-foreground">Tiến độ mục tiêu</span>
                                                        <span className={`font-medium ${
                                                            isNearlyComplete
                                                                ? 'text-amber-600 dark:text-amber-500'
                                                                : 'text-emerald-600 dark:text-emerald-500'
                                                        }`}>
                                                            {percentage}%
                                                        </span>
                                                    </div>

                                                    <Progress
                                                        value={percentage}
                                                        className={`h-2.5 ${
                                                            isNearlyComplete
                                                                ? 'bg-amber-100 dark:bg-amber-950/50'
                                                                : 'bg-emerald-100 dark:bg-emerald-950/50'
                                                        }`}
                                                    />
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <div className="space-y-1">
                                                        <span className="text-muted-foreground block">Hiện tại</span>
                                                        <span className="font-medium text-base text-foreground">
                                                            {formatCurrency(target.currentAmount)}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-right">
                                                        <span className="text-muted-foreground block">Mục tiêu</span>
                                                        <span className="font-medium text-base text-foreground">
                                                            {formatCurrency(target.targetAmount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {filteredTargets.length === 0 && !isLoading && (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Image
                                            src={NoDataPlaceHolder}
                                            alt="No results"
                                            width={60}
                                            height={60}
                                            className="opacity-50 mb-4"
                                        />
                                        <p className="text-muted-foreground">
                                            Không tìm thấy mục tiêu nào
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in-50">
                            <div className="relative w-16 h-16 mb-4">
                                <Image
                                    src={NoDataPlaceHolder}
                                    alt="Loading"
                                    fill
                                    className="object-contain opacity-80"
                                />
                            </div>
                            <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </div>
    );
};

export default ViewAllTargets;
